# lkm4ctr

`lkm4ctr` automatically loads `lkm4ctr.ko` to enable Docker and containers on all currently released arm64 Android GKI KMIs; no custom kernel flash. The module is intended for rooted devices and must match the device KMI exactly.

See [copying.txt](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/copying.txt) for the project and vendored-source license terms.

## Start here

- Check the device kernel: `uname -a`

- Either download the matching `lkm4ctr-4.0.5-<kmi>-arm64.ko` release asset or install `lkm4ctr-kernelsu-module.zip` in KernelSU; the KernelSU module selects the matching KMI automatically

- Install `fuse-overlayfs` and configure Docker to use it by default (see the user manual)

- For a standalone `.ko` install, load it as root: `sudo insmod /path/to/lkm4ctr-4.0.5-<matching-kmi>-arm64.ko` (KernelSU installs and loads the bundled module itself)

- Start Docker: `sudo dockerd --config-file="$PREFIX/etc/docker/daemon.json" --bridge=none --experimental`

- Test a container: `sudo docker run --network=host --rm -it docker.io/library/alpine:latest /bin/sh`

`NET_NS` is currently bookkeeping-only, so host networking is required for network access. Read the manual before loading a module on a real device.

The KernelSU ZIP includes every KMI build and `lkm4ctr_checker`, enables boot auto-load by default, and provides an action button plus a multilingual WebUI for module control and checker output. Published releases include an update feed so KernelSU Manager can offer in-app updates when `versionCode` increases.

## Documentation

- [English user manual](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/en/USER_GUIDE.md) · [简体中文](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/zh-hans/USER_GUIDE.md) · [繁體中文](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/zh-hant/USER_GUIDE.md)

- [English architecture and developer documentation](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/en/architecture/GLUE.md)

- [English checker documentation](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/en/developer/CHECKER.md)

- [English vendor-kernel documentation](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/en/developer/VENDOR_KERNEL.md)

- [简体中文文档索引](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/zh-hans/README.md) · [繁體中文文件索引](https://github.com/cyanmint/lkm4ctr/blob/d033555d2d7f9c302b45d787ebcbbe9faed434fc/docs/zh-hant/README.md)

`AGENTS.md` is the repository's contributor/agent contract and intentionally remains at the repository root.
