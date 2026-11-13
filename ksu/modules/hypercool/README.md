# HyperCool - Heat & Battery Fix

![](/assets/c0f56903a89ab462.jpg)

KernelSU / Magisk module for Qualcomm and MediaTek phones. Less heat, less battery drain, longer battery life.
Focused on battery life, not peak performance.

  [![](/assets/256f52f914e2ce6c.svg)](https://github.com/yudharn/HyperCool/releases)
  [![](/assets/2311ddf26bde6ebe.svg)](https://github.com/yudharn/HyperCool/stargazers)
  ![](/assets/f00e750980c4236b.svg)
  [![](/assets/76ad9b1026680ea4.svg)](https://github.com/yudharn/HyperCool/releases/latest)

Everything is set from the WebUI and applied once at the next boot. Nothing keeps running except
small keepers (charge limit, screen-off keeper that also serves Keep Wi-Fi on, Compact background apps, Location and Bluetooth off, F2FS garbage collection and auto app optimization, auto cache clean, CPU keeper, adaptive refresh rate, battery calibration), and only if you turn them on.

`Every feature has its own ON/OFF switch in the WebUI, changes apply once at boot, and turning a feature off (or uninstalling) puts the original values back`

## Screenshots

  
    
      ![](/assets/1300e645013e74b2.png)

      **Home**
    
    
      ![](/assets/d6f2539cbceda4fc.png)

      **Heat control**
    
    
      ![](/assets/8118b2c0563103da.png)

      **Battery drain (kernel)**
    
  
  
    
      ![](/assets/40c705d6a44b1e3c.png)

      **Protected apps**
    
    
      ![](/assets/2f8e4ddf39963286.png)

      **Battery calibration**
    
    
      ![](/assets/e34564357902e16e.png)

      **Long battery**
    
  
  
    
      ![](/assets/220787f992830f27.png)

      **Advanced**
    
    
      ![](/assets/532c49587c4ebbe4.png)

      **Extra kernel tuning**
    
    
      ![](/assets/d5a3c4a80d343cb6.png)

      **RAM management**
    
  
  
    
      ![](/assets/16a0be75da31d17f.png)

      **Google services**
    
    
      ![](/assets/d8e8463c91e54408.png)

      **Storage**
    
    
      ![](/assets/74ec72f4f19a4a5f.png)

      **App cache**
    
  
  
    
      ![](/assets/3347687bf3716f0f.png)

      **Tools**
    
    
      ![](/assets/bda66521b1ec297d.png)

      **Extra power saving**
    
    
      ![](/assets/8a861d6bc183ba1d.png)

      **Battery drain (system)**
    
  

## Features

**Heat control**

- Big-core frequency cap (with lock)

- Little-core frequency cap (default off, with lock)

- GPU frequency cap (from your own GPU table, with lock)

- GPU power collapse

- Less aggressive CPU governor (WALT / schedutil)

- Disable kernel touch boost

- Background apps on little cores

- Park prime core (Qualcomm; switches core_ctl on when the kernel has it off, checks that the core is really parked, locks the nodes)

- CPU keeper: keeps the big/little caps and the prime parking in place when the ROM undoes them

- Disable UI blur

- Cooler charging (current limit) and charge limit ~80% (Xiaomi)

**Battery drain (kernel)**

- Adaptive screen-off power profile

- Deep CPU sleep, UFS power saving

- Fewer writeback wakeups, less I/O accounting

- Turn off kernel debug, kernel wakelock blocker

- Keep Wi-Fi on while the screen is off (turns it on again when the ROM switches it off; Wi-Fi you switch off yourself stays off)

- Location and Bluetooth off after a long screen-off (both come back when the screen turns on; off by default)

- F2FS garbage collection with the screen off (Storage; frees space that only GC can give back; once a week at most, no charger needed; off by default)

- Auto optimize apps (dex2oat) once a week with the screen off (Storage; speed-profile, no force recompile, result as a notification; off by default)

- Top battery use (Home; read only: user apps, system apps, system services and hardware, from Android battery stats)

**Apps**

- Keep important apps alive

- Restrict other user apps

- Block apps in background

- Disable apps (pick with care)

**Battery drain (system)**

- Cached app freezer, aggressive Doze, GMS Doze

- Wi-Fi/BT scanning off, limit background location, network standby saving

- App Standby, less stats, telemetry off

- Disable analytics & ad packages, Joyose off, less logging

**Long battery**

- Stronger Battery Saver, auto saver level

- Dim screen on Battery Saver, Smart Pixels (ROMs that have it)

- Refresh rate cap, adaptive refresh rate (high on touch, low when idle), animation scale

**Extras**

- Scheduler, network and I/O tuning

- MiGT / Metis off (Xiaomi)

- Balanced system defaults, common kernel tuning

- RAM optimizer, multitasking profile

- ZRAM size & compression (2-8 GB or custom up to 12 GB)

- GMS ads/analytics freeze, more telemetry off

- Log cleanup, vendor diagnostics off

- Kernel power-saving switches, Energy Aware Scheduler

- Power saving for idle USB / I2C / SPI devices (opt-in)

- Fewer background jobs: JobScheduler batches background work for 1-2 hours (Balanced / Strong, read back and put back if the ROM ignores it)

- Compact background apps: compacts the memory of background apps after the screen has been off, only when free RAM is low

- Auto clean app cache (every 1 to 7 days), apps that keep their cache, cache clean notification

- Optimize apps (dex2oat) for all apps with live progress (Extras tab, on demand)

- Boot notification when everything is applied

**Home**

- Search: find any feature by name and jump to it

- Idle drain: battery drop per hour with the screen off since the last unplug (shows after a 1% drop)

- Battery check: health, capacity, cycle count, temperature and more

- Battery calibration: guided full cycle (5% → 100% → until charging finishes) so the battery % is accurate (optionally deletes batterystats.bin)

Every feature shows what it changes and the result of the last boot.
Turning a feature off puts the original value back. Unsupported features are skipped.

## Requirements

- Android 11+

- KernelSU, KernelSU Next or APatch (Magisk: open the WebUI with MMRL or KsuWebUI)

- Qualcomm or MediaTek SoC, any ROM

## Files

- `/data/adb/hypercool/config.conf` settings

- `/data/adb/hypercool/status.conf` last boot result

- `/data/adb/hypercool/boot.log` log

- `sh /data/adb/hypercool/restore.sh --all` restore every system change by hand

## Credits

- Frosty by Drsexo

- Power Saver Pro by @ShastikXD & @TempMeow (some code by @kveld9)

- Hyper Optimize by Tatsh

- Xtreme Battery Saver (DethByte64), Universal GMS Doze, sysconfig-patcher

## Support

Note

If HyperCool is useful to you, consider supporting development:

[![](/assets/67f1a175c0b61642.svg)](https://ko-fi.com/yudharn)

Other ways to support: [SociaBuzz](https://sociabuzz.com/yudharn) · [QRIS](https://t.me/ArchivesModules/1476)

[![](/assets/0668b40be8aec3b1.svg)](https://t.me/ModuleArchives)

## Disclaimer

HyperCool changes kernel and system settings. Use it at your own risk; the author is not responsible
for bootloops, data loss or damage. Make a backup first, and turn features off one by one if something
misbehaves. Provided without any warranty (see the GPL).

## License

GPL-3.0-or-later. Copyright (C) 2026 Yudharn. See [LICENSE](https://github.com/yudharn/HyperCool/blob/9bdf33e79d8cbce75d82474ec3312dd8ccadfdfb/LICENSE).
Modified versions must stay GPL-3.0, keep the source open and keep this copyright notice.
Google Sans font: SIL Open Font License (`webroot/GoogleSans-OFL.txt`).
