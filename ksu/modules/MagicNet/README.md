![](/assets/3c34d4d23d484c3b.png)
  
# MagicNet

  A transparent networking control plane for rooted Android.

[![](/assets/32a24f01fb3cc3c1.svg)](https://github.com/LIghtJUNction/MagicNet/releases/tag/v1.9.3)
[![](/assets/3f7ffdd462fb8ded.svg)](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/BUILD_PROMPT.md)
[![](/assets/47d376a103861b54.svg)](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/LICENSE)

[English](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/README.en.md) · [Русский](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/README.ru.md) · [Download](https://github.com/LIghtJUNction/MagicNet/releases) · [Evidence](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/VERIFICATION.md)

MagicNet manages subscriptions, app/domain/Wi-Fi/hotspot routing, DNS, selectors and Tailscale through a multilingual web console and CLI. It supports explicit `tun|ebpf` modes, defaults to TUN, and packages a sing-box-compatible runtime for Android root/arm64 with Magisk, KernelSU or APatch.

The Astra Pro Android module lives in [generated/magicnet-astra-pro](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/generated/magicnet-astra-pro). New installations use TUN. Its transport core lives in [generated/magicbox](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/generated/magicbox), pinned to the revision in the module’s `core.lock`. The two source trees can be inspected and tested independently.

## Start here

Goal
Entry point

Install and use MagicNet
[Releases](https://github.com/LIghtJUNction/MagicNet/releases) and [v1.9.3 installation notes](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/docs/releases/v1.9.3.md)

Build the maintained implementation
[Source repository](https://github.com/LIghtJUNction/magicnet-android) and [build guide](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/generated/magicnet-android/docs/build.md)

Rebuild from requirements
[Product recipe](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/BUILD_PROMPT.md) and [acceptance](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/ACCEPTANCE.md)

Publish a version
[Release guide](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/docs/releasing.md)

## Current state

Layer
Current state

Published Android package
[`v1.9.3 / 10621`](https://github.com/LIghtJUNction/MagicNet/releases/tag/v1.9.3)

Recipe
`0.3.40`

Fixed implementation commit
`d35ccffba60d8db84f7dc75f93904413b40d0369`

Fixed sing-box core
`3a155d21872b22e6b9b75326c98d11f7ff159a2e` / `1.15.0-alpha.13`

The recipe defines required behavior; the pinned source provides the maintained implementation; Releases provide installable artifacts. [Verification](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/VERIFICATION.md) records source tests, package checks, Android emulator results and physical-device observations separately.

A locally built `v1.9.1 / 10619` candidate from source [`5169e071`](https://github.com/LIghtJUNction/magicnet-android/commit/5169e07155a47d16f3c5e610a8aa368cc2d08b02) has been checked on one ARM64 phone: upgrade with configuration retention, HTTPS from an ordinary app UID with a real subscription, navigation across 14 pages, a physical tap opening Zashboard with local node data, and a 10-second cellular interruption followed by 180 seconds of observation. Application HTTPS recovered after the interruption, while the strict upstream connectivity check retained an endpoint-specific degraded result. This device evidence belongs to that candidate; the newer implementation pinned above has separate CI evidence.

Broader OEM coverage, minimum Android/WebView versions and sustained mobile performance remain open; see [verification](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/VERIFICATION.md), [performance](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/PERFORMANCE.md) and [Issue tracking](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/ISSUE_TRIAGE_2026-11-06.md).

## Build the maintained implementation

```
git clone --recurse-submodules https://github.com/LIghtJUNction/MagicNet.git
cd MagicNet
git submodule update --init --recursive generated/magicnet-android
cd generated/magicnet-android
kam build -j 2

```

Follow the [build guide](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/generated/magicnet-android/docs/build.md) for the pinned Rust, Go, Node, Java and Android toolchains. The complete local package is `generated/magicnet-android/dist/MagicNet.zip` relative to the primary repository.

## Rebuild from the recipe

Install Git and the Recipkg CLI, then render the complete requirements for an implementation agent:

```
set -eu
recipkg check recipes/magicnet
recipe_tmp="$(mktemp -d)"
trap 'rm -rf "$recipe_tmp"' EXIT
recipkg pack recipes/magicnet -o "$recipe_tmp/magicnet.recipe.tar.gz"
recipkg check "$recipe_tmp/magicnet.recipe.tar.gz"
recipkg build "$recipe_tmp/magicnet.recipe.tar.gz" --lang zh-CN

```

`recipkg build` renders a prompt. The agent must implement the product and execute [ACCEPTANCE.md](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/ACCEPTANCE.md). Independent reconstruction starts with an empty implementation directory and the complete Markdown dependency closure; its permitted external assets are defined in the recipe. Keep `.env`, subscriptions, credentials and private device data outside source, archives and prompts.

The eight packages cover the product, control plane, network runtime, packet engine, routing policy, web console, module delivery and shared quality requirements. [DEPENDENCIES.md](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/DEPENDENCIES.md) maps their responsibilities.

## Development and release

Update affected recipes, interfaces and acceptance cases with behavior changes. Verify and push source changes before updating the primary repository's gitlink. [Build and release MagicNet](https://github.com/LIghtJUNction/MagicNet/actions/workflows/release.yml) supports `build`, `verify` and `publish`, version bumping and exact versions; [releasing.md](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/docs/releasing.md) owns the inputs and recovery procedure.

Local checks:

```
python3 scripts/check-recipes.py
python3 scripts/test-release.py
python3 scripts/test-release-plan.py
python3 scripts/test-check-recipes.py

```

## Sources and license

[SOURCE_AUDIT.md](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/SOURCE_AUDIT.md) records inspected source; [PROVENANCE.md](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/recipes/magicnet/PROVENANCE.md) retains attribution and historical anchors, including the v1.8.0 import. MagicNet uses the [MIT License](https://github.com/LIghtJUNction/MagicNet/blob/e1e9af0ae0e989ae3dd9a3fc3384a7e15aef3170/LICENSE); third-party components retain their own licenses.
