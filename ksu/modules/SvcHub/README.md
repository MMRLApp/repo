![](/assets/0a2dfed188db2b04.png)

# SvcHub

  [中文](https://github.com/LimpidMo/SvcHub/blob/3c49756e530b24f3bcfd7d84bac4b03a973e05a9/README.md) | [English](https://github.com/LimpidMo/SvcHub/blob/3c49756e530b24f3bcfd7d84bac4b03a973e05a9/README.en.md) 
  
    **一个 Termux / 二进制服务启动、保活和更新的管理模块，支持多种启停策略，WebUI 聚合管理**
  

  
    [
      ![](/assets/282c53ad3193484e.svg)
    ](https://developer.android.com/)
    [
      ![](/assets/d390d8fdfc9764bf.svg)
    ](https://www.gnu.org/software/bash/)
    [
      ![](/assets/6db2fa65122ef0d4.svg)
    ](https://kernelsu.org/)
    [
      ![](/assets/ac0c2431c7f05b4d.svg)
    ](https://github.com/LimpidMo/SvcHub/blob/master/LICENSE)
    [
      ![](/assets/2526e30569f1ae5c.svg)
    ](https://github.com/LimpidMo/SvcHub/releases)
    [
      ![](/assets/7c92d4cce456ec65.svg)
    ](https://github.com/LimpidMo/SvcHub/releases)
    [
      ![](/assets/63eeccdad29d5a62.svg)
    ](https://github.com/LimpidMo/SvcHub/stargazers)
  

  
    在线文档：[limpidmo.github.io/SvcHub](https://limpidmo.github.io/SvcHub)
  

  
    **初衷就是为了聚合运行一些服务，省得一个服务装一个模块，统一管理服务。若你觉得好用，欢迎给仓库来个 Star ⭐~**
  

## 界面概览

服务状态
服务配置
功能设置

![](/assets/3c84288e590ce6fa.png)
![](/assets/b576031b33ba63d0.png)
![](/assets/f86764cce425410c.png)

启停功能
二进制更新
服务日志

![](/assets/b72ac713a90d7caf.png)
![](/assets/2ca8e41a2740124e.png)
![](/assets/a011cc5595767b97.png)

## 核心功能

- **WebUI**：中英双语界面，统一管理服务启停、配置管理、查看服务日志及占用；网页访问支持 PWA 安装

- **两类服务**：支持 **Termux 服务** 与 **二进制服务** 的启动配置及收尾命令管理。Termux 服务无需软件挂后台，可以 root 执行

- **多种启停策略**：支持定时窗口启停、亮屏启停、Wi-Fi 启停等策略满足多样化启停需求

- **巡检保活**：默认 60 秒巡检一次（可配置 10~86400 秒），自动拉起带 `start` 标签的服务，日志自动轮转

- **更新服务**：支持来源于 GitHub 仓库的二进制文件更新，可按每小时/天/周检查版本，可开启自动更新，替换失败自动回滚

注：本模块默认不开启唤醒锁，如需减少锁屏 Doze 或 CPU 休眠的对巡检、更新检查等的影响，可在「基本设置」开启唤醒锁

## 快速开始

- [Releases](https://github.com/LimpidMo/SvcHub/releases/) 中下载模块 ZIP

- 在 Root 管理器中 → 模块 → 从本地安装，选择对应 ZIP 文件刷入，音量键可选是否挂载 DNS 解析配置，默认不挂载

- 安装完成后重启设备，升级时自动保留已有配置

- 在 KernelSU 或 APatch 等管理器 → 模块 → 点击打开 SvcHub → 进入 WebUI

Magisk 用户无管理器 WebUI 入口，首次安装默认开启外部访问；浏览器访问 `http://127.0.0.1:5555`，默认密码 `admin`，首次登录强制修改。KernelSU / APatch 默认关闭外部访问，改密后在管理器内开启

## 注意事项

- 请自行确认服务以及命令的安全性，再放到模块中应用和执行，自行对操作和处理结果负责

- Termux 服务依赖已安装的 Termux 应用并下载`pkg install`对应软件包，二进制服务自行从可信渠道下载使用，并赋权（`chmod +x`）使用。

- 所有脚本为 POSIX sh，兼容 Android `/system/bin/sh`

- 玩机有风险，请自行备份数据。代码全公开，请自行检阅后按需刷入

## 项目文档

完整使用说明与开发文档见 [https://limpidmo.github.io/SvcHub](https://limpidmo.github.io/SvcHub)。

**指南**

- [简介](https://limpidmo.github.io/SvcHub/guide/) — 模块定位与基本概念

- [启停功能](https://limpidmo.github.io/SvcHub/guide/features) — 定时 / 亮屏 / Wi-Fi 启停与优先级

- [巡检保活](https://limpidmo.github.io/SvcHub/guide/keepalive) — 巡检间隔与服务保活机制

- [服务配置示例](https://limpidmo.github.io/SvcHub/guide/examples) — Termux 服务与二进制服务配置范例

- [Termux 服务](https://limpidmo.github.io/SvcHub/guide/termux) · [二进制服务](https://limpidmo.github.io/SvcHub/guide/binary) — 两类服务的配置参考

- [注意事项](https://limpidmo.github.io/SvcHub/guide/notes) · [常见问题](https://limpidmo.github.io/SvcHub/guide/faq) — 使用须知与排错

- [更新日志](https://limpidmo.github.io/SvcHub/guide/changelog) — 各版本变更记录

**开发**

- [本地开发联调](https://limpidmo.github.io/SvcHub/dev/) — 电脑沙盒运行真实脚本

- [模块构建](https://limpidmo.github.io/SvcHub/dev/build) — 打包与校验流程

## 许可证

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html) · 完整文本见 [LICENSE](https://github.com/LimpidMo/SvcHub/blob/3c49756e530b24f3bcfd7d84bac4b03a973e05a9/LICENSE)

Copyright (C) 2026 LimpidMo
