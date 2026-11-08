# Shellscaled

Run Tailscale natively on rooted Android without occupying Android’s VPN slot.

[简体中文](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/README.md) · **English**

[![](/assets/8bedeca6e459b2b0.svg)](https://github.com/KyuubiRan/Shellscaled/releases)

[Download the latest release](https://github.com/KyuubiRan/Shellscaled/releases) · Magisk / KernelSU · ARM64

APatch support is experimental. Use a Pre-release containing the APatch changes; service startup under APatch is still being verified.

**Choose either Shellscaled or `magisk-tailscaled`.** Do not enable both. To switch, disable the old module and reboot before installing Shellscaled. Its sign-in state is not migrated automatically.

  ![](/assets/7fc23f59ea6b1393.png)
  ![](/assets/4d8e16ed448ad229.png)
  ![](/assets/5bceed0451b6499f.png)

First-time sign-in
![](/assets/2bf6c98bc054b360.png)

## Features

- Connect or disconnect from your module manager and see connection status on the module card.

- KernelSU pages with address copying, a device list, preferences, Tailscale commands and links to the admin console and project home.

- Simplified Chinese, Traditional Chinese and English, following your system language or a manual selection.

- Offline installation, with your account and preferences preserved during updates.

## Installation

- Download the **arm64** ZIP package from [Releases](https://github.com/KyuubiRan/Shellscaled/releases).

- In **Magisk**, **KernelSU** or **APatch Manager**, choose **Install from storage** and select the ZIP.

- Installing the module applies within seconds without a reboot (designed for all managers, verified on KernelSU Next). `tailscaled` restarts only when its binary changed, which interrupts the tailnet for a few seconds; otherwise the tailnet is not interrupted. If live update is not possible, the module activates at **reboot** instead. Tap the module action button to connect and follow the sign-in instructions. KernelSU users can also open the module page and choose **Sign in to Tailscale**.

Sign in from a terminal

```
su -c 'tailscale login'

```

## Usage

After running `su` in `adb shell` or a terminal, use `tailscale` directly. Use `tailscaled` to start, stop, restart or check the service.

Use the module action button in your manager to connect or disconnect. KernelSU users can also open the settings page to manage subnet routes, incoming connections and LAN access when using an exit node. Switch changes take effect immediately.

**Network roles** lets you select, switch or stop using an exit node, advertise this device as an exit node, and advertise CIDR subnet routes. Advertisements require approval in the Tailscale console. Android forwarding, NAT and SELinux behavior require separate validation.

The **MagicDNS split resolver** switch (off by default) resolves tailnet names without taking over system DNS. See [Android networking](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/docs/android-network.md) for its behavior and limitations.

**Receive files** defaults to `Download/Taildrop` in shared storage. Browse ordinary directories in primary shared storage, save your choice, and receive pending files. App-private directories are protected. See [Taildrop](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/docs/taildrop.md) for the receive workflow. See [Live update](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/docs/hot-update.md) for how module updates apply without a reboot.

**Receive files** defaults to `Download/Taildrop` in shared storage. Browse ordinary directories in primary shared storage, save your choice, and receive pending files. App-private directories are protected. See [Taildrop](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/docs/taildrop.md) for the receive workflow.

Tap a local address to copy it. The Devices page lets you search visible devices, check online status and copy names or addresses.

To update Tailscale on its own, choose Stable or Preview under **Binary updates** in Settings. Your account and preferences are retained. For module interface and feature updates, install the new module package. Installing it switches to the new module within seconds without a reboot (designed for all managers, verified on KernelSU Next); `tailscaled` restarts only when its binary changed, which interrupts the tailnet for a few seconds; otherwise the tailnet is not interrupted. Close and reopen the WebUI. If live update is not possible, the module activates at reboot instead. Uninstalling the module deletes its account and preferences.

## Credits and license

Shellscaled is a third-party project based on [Tailscale](https://github.com/tailscale/tailscale), with Android adaptations informed by [anasfanani/tailscale-android-cli](https://github.com/anasfanani/tailscale-android-cli), and originating from [anasfanani/magisk-tailscaled](https://github.com/anasfanani/magisk-tailscaled).

Distributed under the [BSD-3-Clause license](https://github.com/KyuubiRan/Shellscaled/blob/1b0d9799e3a55e4a985421fb19bfb3979509c5f8/LICENSE), retaining upstream copyright and patent notices. Not affiliated with Tailscale Inc.
