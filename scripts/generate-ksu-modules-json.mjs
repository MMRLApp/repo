#!/usr/bin/env node
/**
 * generate-ksu-modules-json.mjs
 * ---------------------------------------------------------------------------
 * Pulls the KernelSU modules repo (https://modules.kernelsu.org) and adapts it
 * into the flat "modules.json" repo format MMRL/Magisk module managers expect.
 *
 * Source layout:
 *   GET /api/v1/modules.json                 -> index (summaries, each with `detail`)
 *   GET /api/v1/modules/<id>.json            -> detail (license, support, releases[], `readme` path)
 *   GET /api/v1/modules/<id>/readme          -> README (fetched separately)
 *
 * Each module's README is saved to modules/<id>/README.md and each release's
 * changelog (the API only provides HTML, converted to Markdown here) to
 * modules/<id>/changelogs/<version>.md. Raw links to those files fill
 * `readme` / `versions[].changelog`.
 *
 * Required env vars:
 *   RAW_BASE_URL   raw base of the repo + branch the output is pushed to,
 *                       e.g. https://raw.githubusercontent.com/<owner>/<repo>/main
 *
 * Optional env vars:
 *   KSU_BASE_URL        default https://modules.kernelsu.org
 *   OUTPUT_PATH    default ./modules.json
 *   META_PATH      default ./repo.meta.json
 *   CONCURRENCY    default 8
 *
 * Debug:
 *   node generate-ksu-modules-json.mjs --inspect <id>
 *   -> prints the detail JSON and the raw README response head, then exits.
 * ---------------------------------------------------------------------------
 * NOTE: the README endpoint's response format (markdown / HTML / JSON) was not
 * verified. fetchReadme() handles all three; check one with --inspect.
 * ---------------------------------------------------------------------------
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const KSU_BASE_URL = (process.env.KSU_BASE_URL || "https://modules.kernelsu.org").replace(/\/$/, "");
const OUTPUT_PATH = process.env.OUTPUT_PATH || "./modules.json";
const MODULES_PATH = process.env.MODULES_PATH || "modules";
const META_PATH = process.env.META_PATH || "./repo.meta.json";
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);

const inspectIdx = process.argv.indexOf("--inspect");
const INSPECT_ID = inspectIdx !== -1 ? process.argv[inspectIdx + 1] : null;

const RAW_BASE_URL = INSPECT_ID ? "" : requireEnv("MMRL_RAW_BASE_URL").replace(/\/$/, "");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves a (possibly relative) path from the API against the site root. */
function abs(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  return new URL(pathOrUrl, `${KSU_BASE_URL}/`).toString();
}

/** GET with retries (honours 429 Retry-After). Returns the Response. */
async function apiFetch(pathOrUrl, { retries = 3, accept = "*/*" } = {}) {
  const url = abs(pathOrUrl);
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: accept } });
      if (res.status === 429) {
        await sleep(Number(res.headers.get("retry-after") || 2) * 1000);
        continue;
      }
      if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await sleep(500 * attempt);
    }
  }
  throw lastErr;
}

async function getJson(pathOrUrl) {
  return (await apiFetch(pathOrUrl, { accept: "application/json" })).json();
}

/** Runs `worker` over `items` with at most `limit` in flight at once. */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function pick(obj, keys) {
  for (const key of keys) {
    const v = obj?.[key];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function toEpochSeconds(iso) {
  if (!iso) return 0;
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? ms / 1000 : 0;
}

function normalizeSize(size) {
  if (size == null) return undefined;
  const n = Number(size);
  return Number.isFinite(n) ? n : undefined;
}

function assertSafeId(id) {
  if (!/^[A-Za-z0-9._-]+$/.test(id) || id === "." || id === "..") {
    throw new Error(`Unsafe module id "${id}"`);
  }
}

function safeFileName(name) {
  return String(name).replace(/[^A-Za-z0-9._-]/g, "_");
}

/** Minimal dependency-free HTML -> Markdown (covers what release notes / READMEs use). */
function htmlToMarkdown(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, c) => `\n\`\`\`\n${c}\n\`\`\`\n`);
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, l, t) => `\n${"#".repeat(Number(l))} ${t}\n`);
  s = s.replace(/<img [^>]*?src="([^"]*)"[^>]*>/gi, "![]($1)");
  s = s.replace(/<a [^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, "**$2**");
  s = s.replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, "*$2*");
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  s = s.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/(p|ul|ol|div|blockquote|table)>/gi, "\n\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

/** Fetches the README endpoint; tolerates markdown, HTML, or a JSON wrapper. */
async function fetchReadme(readmePath) {
  if (!readmePath) return "";
  const res = await apiFetch(readmePath);
  const type = res.headers.get("content-type") || "";
  let text = await res.text();

  if (type.includes("json")) {
    const data = JSON.parse(text);
    text = typeof data === "string"
      ? data
      : pick(data, ["markdown", "readme", "content", "body", "html"]) ?? "";
  }
  return /^\s*</.test(text) ? htmlToMarkdown(text) : text.trim();
}

async function writeModuleReadme(id, readme) {
  if (!readme) return undefined;
  assertSafeId(id);
  const dir = join(MODULES_PATH, id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "README.md"), readme + "\n", "utf8");
  return `${RAW_BASE_URL}/${MODULES_PATH}/${encodeURIComponent(id)}/README.md`;
}

/** Returns Map<release, rawUrl>; releases without a changelog are omitted. */
async function writeReleaseChangelogs(id, releases) {
  assertSafeId(id);
  const dir = join(MODULES_PATH, id, "changelogs");
  const urls = new Map();
  const usedNames = new Set();

  for (const [index, release] of releases.entries()) {
    const changelog = htmlToMarkdown(release.changelogHtml);
    if (!changelog) continue;

    let fileName = safeFileName(release.version ?? release.tag);
    if (usedNames.has(fileName)) fileName = `${fileName}_${index}`;
    usedNames.add(fileName);

    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, `${fileName}.md`), changelog + "\n", "utf8");
    urls.set(
      release,
      `${RAW_BASE_URL}/${MODULES_PATH}/${encodeURIComponent(id)}/changelogs/${encodeURIComponent(fileName)}.md`
    );
  }
  return urls;
}

/** One API release -> legacy `versions[]` entry. */
function adaptRelease(release, changelogUrl) {
  return {
    timestamp: toEpochSeconds(release.publishedAt),
    version: release.version ?? release.tag ?? "unknown",
    versionCode: Number(release.versionCode) || 0,
    zipUrl: release.zip?.url ?? "",
    changelog: changelogUrl || "",
    size: normalizeSize(release.zip?.size),
  };
}

/** Index summary + detail -> legacy module entry. */
function adaptModule(summary, detail, readmeUrl, changelogUrls) {
  const releases = detail.releases ?? [];
  const sorted = [...releases].sort(
    (a, b) => toEpochSeconds(a.publishedAt) - toEpochSeconds(b.publishedAt)
  );

  // The index's `stable` points at the release that should be "latest".
  const latest =
    sorted.find((r) => r.version === summary.stable?.version && !r.prerelease) ??
    [...sorted].reverse().find((r) => !r.prerelease) ??
    sorted[sorted.length - 1];

  const versions = sorted.map((r) => adaptRelease(r, changelogUrls.get(r)));
  const firstTs = sorted[0] ? toEpochSeconds(sorted[0].publishedAt) : 0;

  const authors = (summary.authors ?? []).map((a) => a.name).filter(Boolean);
  const sourceUrl = detail.source?.url ?? (summary.starsRepository ? `https://github.com/${summary.starsRepository}` : "");

  const adapted = {
    id: summary.id,
    name: summary.name,
    version: latest?.version ?? summary.stable?.version ?? "unknown",
    versionCode: Number(latest?.versionCode ?? summary.stable?.versionCode) || 0,
    author: authors.join(", ") || undefined,
    description: summary.summary || "",
    readme: readmeUrl,
    support: detail.support || detail.homepage || sourceUrl || undefined,
    license: detail.license || undefined,
    categories: summary.tags?.length ? summary.tags : undefined,
    icon: abs(summary.icon ?? undefined),
    added: firstTs,
    timestamp: toEpochSeconds(summary.updatedAt),
    size: normalizeSize(latest?.zip?.size),
    // `permissions` isn't exposed by the API. `metamodule` is the only capability flag.
    permissions: [],
    features: summary.metamodule ? { metamodule: true } : {},
    stars: summary.stars ?? undefined,
    track: {
      type: "ONLINE_JSON",
      added: firstTs || null,
      source: sourceUrl,
      antifeatures: null,
      build_metadata: null,
    },
    versions,
  };

  for (const key of Object.keys(adapted)) {
    if (adapted[key] === undefined) delete adapted[key];
  }
  return adapted;
}

async function loadRepoMeta() {
  return JSON.parse(await readFile(META_PATH, "utf8"));
}

async function loadPreviousVersion() {
  try {
    const previous = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
    return previous?.metadata?.version ?? 0;
  } catch {
    return 0;
  }
}

async function main() {
  console.log(`Fetching module index from ${KSU_BASE_URL} ...`);
  const index = await getJson("/api/v1/modules.json");
  const summaries = index.modules ?? [];

  if (INSPECT_ID) {
    const summary = summaries.find((s) => s.id === INSPECT_ID);
    if (!summary) {
      console.error(`No module "${INSPECT_ID}" in the index.`);
      process.exit(1);
    }
    const detail = await getJson(summary.detail);
    console.log(JSON.stringify(detail, null, 2));
    if (detail.readme) {
      const res = await apiFetch(detail.readme);
      console.log(`\n--- README: ${res.headers.get("content-type")} ---`);
      console.log((await res.text()).slice(0, 800));
    }
    return;
  }

  console.log(`Found ${summaries.length} modules (index build ${index.buildId}). Fetching details ...`);

  const detailed = await mapWithConcurrency(summaries, CONCURRENCY, async (summary) => {
    try {
      const detail = await getJson(summary.detail);

      let readme = "";
      try {
        readme = await fetchReadme(detail.readme);
      } catch (err) {
        console.warn(`  ~ No README for "${summary.id}": ${err.message}`);
      }

      const readmeUrl = await writeModuleReadme(summary.id, readme);
      const changelogUrls = await writeReleaseChangelogs(summary.id, detail.releases ?? []);
      return adaptModule(summary, detail, readmeUrl, changelogUrls);
    } catch (err) {
      console.error(`  ! Skipping module "${summary.id}": ${err.message}`);
      return null;
    }
  });

  const modules = detailed.filter(Boolean).sort((a, b) => a.id.localeCompare(b.id));

  const repoMeta = await loadRepoMeta();
  const previousVersion = await loadPreviousVersion();

  const output = {
    ...repoMeta,
    metadata: {
      version: previousVersion + 1,
      timestamp: Date.now() / 1000,
    },
    modules,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true }).catch(() => {});
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(`Wrote ${modules.length} modules to ${OUTPUT_PATH} (repo version ${output.metadata.version}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});