![](/assets/fb56ff3906426e3d.svg)
  [![](/assets/50c9e65b99fcf07e.svg)](https://auriya.pages.dev/)
  [![](/assets/88bbb9db759382d8.svg)](https://github.com/pavelc4/auriya/releases)
  [![](/assets/dbce25fb06bbbb81.svg)](https://github.com/pavelc4/auriya/blob/cd10b39d93702b6139d5f690246d36449a7b012a/LICENSE)

## About Auriya

**Auriya** is a rooted Android performance optimization daemon written in Rust, paired with a modern Jetpack Compose manager application and native Binder IPC.

Visit the [Official Documentation](https://auriya.pages.dev/) for detailed guides and configuration references.

Note

**Disclaimer**: This module is an experimental hobbyist project. Features and system tuning behaviors may evolve across releases.

## Features

- **Rust Native Daemon**: Background service handling system tweaks, performance tuning, and profile switching.

- **Dynamic Frame-Aware Scheduling**: Dynamically adjusts CPU frequencies based on real-time frametimes.

- **Per-Game Profiles**: Custom target FPS, refresh rates, CPU modes, and automated Do Not Disturb per application.

- **Live Benchmark and Telemetry**: Real-time FPS, temperature, and battery monitoring with session recording.

- **Manager App and Floating HUD**: Jetpack Compose manager interface and real-time on-screen telemetry overlay.

- **Command-Line Interface (`auriyactl`)**: Terminal utility for status monitoring and profile management.

## Screenshots

Home
Games
Tuning

![](/assets/ab756f7919bd4386.png)
![](/assets/3a2c52f2b09e3f9a.png)
![](/assets/c9cd4367c21a631f.png)

Telemetry
Benchmark
Floating HUD

![](/assets/ad6391eb731e988c.png)
![](/assets/8fde1579c170a73c.png)
![](/assets/c8b4f8b0285dc00d.png)

Domain Config
Customization
Settings

![](/assets/3a88aad0e746864b.png)
![](/assets/79ede5281dc7dba7.png)
![](/assets/e446744f464106f2.png)

## Documentation

Detailed guides, architectural references, and API documentation are available:

- [auriyactl CLI Reference](https://github.com/pavelc4/auriya/blob/cd10b39d93702b6139d5f690246d36449a7b012a/doc/auriyactl.md)

- [Installation Guide](https://auriya.pages.dev/getting-started/installation/)

- [Configuration and Profiles](https://auriya.pages.dev/getting-started/configuration/)

- [Telemetry Protocol and FPS Benchmark API](https://auriya.pages.dev/reference/stats-api/)

- [Architecture Overview](https://auriya.pages.dev/architecture/overview/)

## Supported Root Managers

- [Magisk](https://github.com/topjohnwu/Magisk)

- [KernelSU](https://github.com/tiann/KernelSU)

- [APatch](https://github.com/bmax121/APatch)

## Resources

- [Documentation Website](https://auriya.pages.dev/)

- [Releases](https://github.com/pavelc4/auriya/releases) (flashable module ZIP packages and release notes)

- [Issues](https://github.com/pavelc4/auriya/issues) (bug reports and tracking)

## Support

If you find Auriya useful, consider starring the repository on GitHub.

## License

Auriya is open-sourced software licensed under the [GNU General Public License v3.0](https://github.com/pavelc4/auriya/blob/cd10b39d93702b6139d5f690246d36449a7b012a/LICENSE).
