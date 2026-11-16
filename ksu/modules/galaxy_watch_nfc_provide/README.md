# Galaxy Watch NFC Provide

[English](https://github.com/gohj99/galaxy_watch_nfc_provide/blob/34c8b0fed3cd30163a412dffe78199c3d5563a9a/README.md) | [简体中文](https://github.com/gohj99/galaxy_watch_nfc_provide/blob/34c8b0fed3cd30163a412dffe78199c3d5563a9a/README.zh-CN.md)

A KernelSU/BakaSU systemless module for making the device's existing NFC configuration editable. It keeps the device's original files backed up, does not hard-code a UID, and does not replace the NFC service.

The module has been tested successfully on a Galaxy Watch 7 44mm. It is designed for Wear OS devices in general, but other watch models and vendors still require their own compatibility checks.

Module ID:

```
galaxy_watch_nfc_provide

```

## Install

- 
Download the ZIP for the version you need from the GitHub **Releases** page. A release asset looks like:

```
galaxy_watch_nfc_provide-v1.0.8.zip

```

- 
Install the ZIP in KernelSU or BakaSU.

- 
Disable the older `nfc_reader_unlock` module if it is installed.

- 
Reboot the device so the module overlays are mounted.

Magic Mount-rs manages the overlays and their removal. This module does not remount firmware partitions or create its own bind mounts.

## Configuration Files

The module creates editable copies of the configuration files below when they exist:

```
/data/adb/modules/galaxy_watch_nfc_provide/system/vendor/etc/libnfc-nxp.conf
/data/adb/modules/galaxy_watch_nfc_provide/system/etc/nfc_rule_configs.xml

```

Original files are kept under:

```
/data/adb/galaxy_watch_nfc_provide/config/
/data/adb/galaxy_watch_nfc_provide/routing/

```

Write changes in place. Do not replace a file with `mv` or `sed -i`; Magic Mount-rs binds the existing inode. Upgrades preserve the currently visible configuration.

## Apply Configuration Changes

After changing `libnfc-nxp.conf` or `nfc_rule_configs.xml`, reinitialize NFC so the running service reads the new values:

```
su -c 'cmd nfc disable-nfc'
sleep 2
su -c 'cmd nfc enable-nfc'

```

Installing or upgrading the module still requires a reboot to mount new overlays. Reinitializing NFC does not prove that a physical tag UID or a wallet application will work.

## Check the Installation

These commands perform read-only checks of the configuration, mounts, and NFC service:

```
su -c '/data/adb/modules/galaxy_watch_nfc_provide/verify.sh'
su -c '/data/adb/modules/galaxy_watch_nfc_provide/nfcconf status'

```

## Optional UID Tool

The UID tool is read-only unless you explicitly run a mutating command:

```
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl probe'
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl get'
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl status'

```

Experimental commands accept a four-byte hexadecimal UID:

```
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl set AABBCCDD'
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl persist AABBCCDD'
su -c '/data/adb/modules/galaxy_watch_nfc_provide/uidctl reset'

```

Do not run these commands during wallet or other NFC activity. The module saves a device-derived baseline and rejects unsafe UID operations when the vendor configuration hash changes. It does not implement MIFARE Classic storage, keys, or authentication.

## Build and Test

Local builds require JDK 17, Android SDK Platform 36, and Build Tools 36.0.0:

```
python tools/build_module.py
python tools/test_core.py
python tools/test_routing.py

```

Local output is written to `dist/`: the module ZIP, its SHA-256 file, and `build-report.json`. These generated files are ignored by Git. Source module scripts live in `scripts/`; the builder places the required runtime entry points at the module ZIP root.

## GitHub Releases

GitHub Actions checks pushes to `master`, pull requests, and manual runs. The workflow reads the version from `module.prop` and automatically adds the `v` prefix:

```
module.prop: version=1.0.8
Git tag:      v1.0.8

```

For a non-PR run, the workflow first checks whether Release `v1.0.8` already exists. If it does not exist, the workflow builds the module, creates tag `v1.0.8` on the current commit, and publishes a GitHub Release. You do not need to create the release tag manually. If the Release already exists, the workflow leaves it unchanged.

The workflow publishes these release assets:

```
galaxy_watch_nfc_provide-v1.0.8.zip
galaxy_watch_nfc_provide-v1.0.8.zip.sha256
build-report.json

```

Pull requests only run validation and never create tags or releases. The workflow does not upload GitHub Actions **Artifacts**. Release files are managed by GitHub and are not committed under `releases/` or `dist/`.

## License

Licensed under the GNU General Public License version 3 or later. See `LICENSE`.
