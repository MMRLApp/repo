# 🔋 ChargingRecord Evolution

**Battery health written right into your root manager's module description — flash and go, zero configuration**

[![](/assets/c2c57ffa544972e2.svg)](https://github.com/f1owkang/CRecordEvolution/releases)
[![](/assets/bab8bfc40527e542.svg)](https://github.com/f1owkang/CRecordEvolution/releases)
[![](/assets/434c512d59364215.svg)](https://go.dev/)
[![](/assets/83dc0fd4758526e3.svg)](#user-content-installation)
[![](/assets/242cc50003eddf0f.svg)](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/LICENSE)

English | [简体中文（中文说明）](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/README_ZH.md)

中文用户请阅读 [README_ZH.md](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/README_ZH.md)（Chinese users: see the [Chinese documentation](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/README_ZH.md)）。

[Features](#user-content-features) | [Screenshots](#user-content-screenshots) | [Installation](#user-content-installation) | [How it works](#user-content-how-it-works) | [FAQ](#user-content-faq) | [Build from source](#user-content-build-from-source) | [Acknowledgements](#user-content-acknowledgements)

## Screenshots

The three WebUI pages (Overview / History / Settings) at a glance. The battery data in the screenshots is **fabricated demo data**, used only to illustrate the UI — it does not represent any real device or any measured result.

Overview
History · Records
History · Trends
Settings

[![](/assets/8fb222defca54b31.png)](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/images/overview-en.png)
[![](/assets/02899d4484d56f1f.png)](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/images/history-en.png)
[![](/assets/5f5e32c283b8d42f.png)](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/images/trends-en.png)
[![](/assets/351e73d3f06cc0f4.png)](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/images/settings-en.png)

## Features

- **Module description**: two lines with kernel/measured health and capacity, cycles and temperature; labels trim on narrow screens instead of wrapping.

- **Overview**: health, measured capacity, resistance and confidence; while charging it also shows live current, power, voltage, session progress and time to full.

- **History**: filter by 7/30/90 days and by charge/discharge, page through the timeline, and read each record's current level and session change as a SOC bar; trend charts take point taps, and the day-by-day capacity archive is kept permanently.

- **Cross-checked estimates**: kernel full charge, mid-stretch calibration, discharge differential and settled sessions each produce a value; a wide spread is flagged as questionable.

- **Degradation trend**: when the trend is significant, shows the weekly loss and "about N months to 80%"; hidden while the data is insufficient.

- **WebUI**: floating pill or Material 3 bottom bar, swipe paging, collapsing header; light/dark themes, AMOLED black, manager palette and bilingual UI.

- **Fully offline**: no network permission, no telemetry; data is written only to `data/battery.db`.

- **Manager support**: Magisk v20.4+ / KernelSU / APatch / MMRL, arm64 only; upgrades keep the previous learning history.

## Installation

Requires Magisk v20.4+, KernelSU, or APatch (arm64 only). Download from [Releases](https://github.com/f1owkang/CRecordEvolution/releases):

Asset
Channel
Notes

`CRecordEvolution-*.zip`
Stable
Statistical algorithm, supports in-app updates

`CRecordEvolution_ML-*.zip`
Experimental
Online-learning algorithm, manual flash only

### Flashing

Pick the zip in your manager. First installs, normal upgrades and reinstalls of the same build proceed without extra prompts — the manager already asks for its own confirmation. The installer only asks for a volume-key confirmation when it detects a **downgrade** or a **stable ↔ ML channel switch**, and shows the installed vs incoming version/channel first (Volume Up = continue, Volume Down = cancel, 30 s timeout = cancel). The UI language follows the phone language automatically. Reboot when done.

If you flashed the wrong build but have not rebooted yet, simply flash the correct zip again: the wrong binary never starts, so you still only reboot once.

### Notes

- Both variants share the same id and name and are mutually exclusive; the ML build is marked by the `-ML` suffix in the module **Version** field (and by the asset name), so the module description matches the stable build.

- Upgrades keep the `data/battery.db` learning history (the installer copies the old data); uninstall the old module (id `Charging_Record`) first when coming from that version.

- Reboot soon after upgrading: until then the old daemon keeps writing with the old units, and Settings shows "Updated — restart to apply"; older Magisk versions have no Action button, so wait for the reboot.

- The language follows the system (or the previous choice) and can be switched in the WebUI; the module description refreshes immediately.

- Only KernelSU / APatch / MMRL can open the module WebUI (Magisk only flashes it); the bottom bar toggles between a floating pill and the classic style, and chart points can be tapped for exact values.

- Bypass charging is recorded too: when the status stays **Full** but the fuel gauge is actually dropping, the discharge session follows the gauge direction; a segment with no reported % drop only accumulates usage and produces no history row.

- Duplicate sessions left by an old multi-daemon install are cleaned automatically, and their charging energy is deducted from the lifetime total; float-charge segments that never became sessions can still leave it slightly high. Capacity estimates are not affected.

- If automatic design-capacity arbitration does not fit your device, set it with `batteryd design set <mAh>`; `design clear` restores automatic detection.

## How it works

The numbers in the description come from two independent paths: one reads the kernel fuel gauge, the other back-calculates from the charging process.

  
  ![](/assets/16654f82c0b7f62b.png)

### Why it works this way

- **No indefinite integration**: a coulomb counter would keep accumulating error; re-deriving the capacity on every charge is like re-syncing a clock.

- **Partial sessions are unreliable**: their derived capacity tends to run high (up to 10% in measured data), so only large-swing sessions are accepted.

- **The mid stretch is more trustworthy, and the discharge differential is the steadiest**: the top few percentage points often report full early, while percentages in the middle hold up better; the discharge differential never goes through `current_now` and integrates inside the chip.

### Capacity trend

Three states: progress until 21 days of data; "no significant change" when no clear movement can be measured; and a weekly loss only once real degradation sets in. A healthy battery staying at "no significant change" is normal — short-term noise is usually larger than real degradation.

### Extra observations

Observations only, never affecting health: resting voltage, constant-current charge time and the incremental-capacity main peak; they show as collecting when data is insufficient — not a fault.

### Current units and calibration

`current_now` is not consistent in practice: some kernels report mA while `charge_*` stays in µAh, and a wrong dimension scales the charge input by 1000×. The module first normalises by the dimension of `charge_full`, then at every charge-session settlement back-derives the current scale from "fuel-gauge differential vs the integral of raw current readings" and persists it; all later readings are converted with that scale, surviving reboots. Everything is automatic — the Settings → "Data" section shows the active scale. Devices without a `charge_counter` node have no reference and keep the dimension-based initial guess.

Warning

Known inaccuracies:

- Using the phone while charging can count load current as charge input, so readings run high; screen-off charging is the most accurate (prolonged high-load use after reaching full is detected and stopped);

- Devices without `cycle_count` have that field omitted; a design capacity that disagrees with the fuel gauge is cross-checked against the device tree (see "Design capacity" below).

### Design capacity

Health is measured full-charge capacity ÷ design capacity, so both sides must use the same basis. Some vivo/iQOO dual-cell kernels put the *battery label* capacity (e.g. 4508 mAh at the label voltage) into `charge_full_design`, while `charge_full` / `charge_counter` report the single-cell charge of the series pack (e.g. 3220 mAh) — dividing them puts a healthy battery at ~60%. The module therefore cross-checks the sysfs value against the `vivo,bat-capacity-mah` device-tree property (same basis as the fuel gauge) and, when the two disagree by more than 20%, keeps the one closer to the measured full charge; a value that would imply more than 110% health is rejected. The chosen number feeds the health percentage, the plausible-capacity window, the cycle equivalent and the "weeks to 80%" projection.

If both sources are wrong for your device, set the correct single-cell design capacity (mAh) from the command line (or write it to `data/design_mah`); run `design clear` to go back to automatic detection:

```
# use 3220 mAh as the (single-cell) design capacity
/data/adb/modules/CRecordEvolution/bin/batteryd design set 3220
# remove the override and go back to automatic detection
/data/adb/modules/CRecordEvolution/bin/batteryd design clear

```

Run `batteryd once` (or reboot) after changing it to refresh the module description and health values.

`batteryd diag` prints which source was used (`design=src=…`).

## FAQ

Is a health reading above 100% a sign of something broken?
No. Factory-rated capacity is generally conservative, so the actual full-charge capacity often exceeds the design value.

How is this different from AccuBattery?
The idea is similar — both integrate charge. The difference is that this module uses root to read the kernel fuel gauge directly: no persistent notification, no network permission, and no dependency on Android's battery stats API.

How long until I see a measured estimate?
A few days of normal use gets you the first number; the ML build needs 30 valid sessions before it starts to diverge.

Will upgrading the module lose my learning history?
No. The flash script copies the old version's `data/` directory (including `battery.db`) into the new version, so estimate records and cycle history are preserved intact.

## Build from source

The WebUI source lives in `webui/` (Preact + Vite) and builds into `webroot/` (generated, not committed); the Go daemon is pure Go (SQLite via `modernc.org/sqlite`, no CGO needed):

```
pnpm install --frozen-lockfile
pnpm run verify   # build + offline scan + 50KB gzip ceiling

go test ./... -count=1
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o bin/batteryd ./cmd/batteryd

```

`bin/batteryd` is the native executable shipped in the module: `once` refreshes the description and prints the current readings (what the manager's Action button runs), `json` emits the Overview/Settings snapshot, `history` emits the paged History data, and `diag` emits a redacted diagnostics summary (Settings → "Copy diagnostics"). On boot `service.sh` starts `batteryd daemon`; see [`AGENTS.md`](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/AGENTS.md) for the full release flow.

## Research

Papers consulted during design (PDF library in [`docs/`](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/docs/)):

- He & Shin, ACM e-Energy '23 — resting-voltage fingerprinting

- Severson et al., Nature Energy 2019 and follow-ups — capacity fade prediction

- Lin et al., Energy 2022 — constant-current charge time (CCCT)

- Fly & Chen 2020, MDPI Energies 2024 review — incremental capacity analysis (ICA)

- arXiv 2410.06422 — probabilistic ML uncertainty quantification

- Zhang et al., ICCK 2025 — coulomb-counter accumulation error

Adoption varies: Lin 2022 (CCCT) and He & Shin (resting voltage) are the method prototypes adopted directly, with parameters recalibrated against this device's data; the rest served as motivation and background reading. The core capacity back-calculation is a standard engineering practice and does not depend on the papers above.

The ± shown by the ML build is an RLS relative-uncertainty indicator, not a strict statistical confidence interval.

## Contributing

Issues and pull requests are welcome. Read [`CONTRIBUTING.md`](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/CONTRIBUTING.md) for the local build/test commands and commit style, report vulnerabilities privately as described in [`SECURITY.md`](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/SECURITY.md), and follow the [`CODE_OF_CONDUCT.md`](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/.github/CODE_OF_CONDUCT.md).

When reporting a battery or estimate issue, attach the redacted `batteryd diag` output (Settings → Copy diagnostics) instead of screenshots only.

## Contributors

ChargingRecord Evolution is built by the following contributors (in no particular order):

[![](/assets/b211e23a8b77f3ca.jpg)](https://github.com/f1owkang)
[![](/assets/eea9ad21ee46caae.png)](https://github.com/hcnk3HrzQe)

## Acknowledgements

- Design concept: 不会梦游的鱼

- Install script: 酷安@阿巴酱

If you like the project, PRs and stars are welcome ⭐

## Disclaimer

- Health, capacity and cycle figures are **estimates** derived from kernel readings and the charging process; they are not guaranteed to match factory ratings or professional test equipment.

- Flashing this module modifies your system's module directory — **proceed at your own risk**, and only after you understand how to flash and roll back with Magisk / KernelSU / APatch.

- Nothing here constitutes repair or safety advice; for swelling, abnormal heat or other battery faults, rely on the manufacturer's diagnostics.

- All data stays in the local `data/battery.db`; the module makes no network requests and never uploads or collects anything.

## License

This project is licensed under [GPL-2.0](https://github.com/f1owkang/CRecordEvolution/blob/2ab2305ccf025bc5194581b058121c9c403418e4/LICENSE).

**Made with ❤ by [f1owkang](https://github.com/f1owkang)**
