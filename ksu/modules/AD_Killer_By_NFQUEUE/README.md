# AD_Killer_By_NFQUEUE

Important

本项目主要参考月虹分享页中的 [YH_Hosts](https://yhyun.asia/)，是基于其产品与功能思路完成的独立开源实现。项目代码主要由大模型辅助，以 Vibe Coding 方式完成。本项目与 YH_Hosts 原作者无隶属或官方合作关系，仅供个人学习、研究与技术交流使用。不保证适用于任何生产环境，也不对误拦截、断网、数据损失、设备异常或其他直接/间接损失承担责任。使用前请自行审查代码、规则源及许可证，并做好备份。

基于 Linux 内核 **NFQUEUE** 的 Android 系统级去广告模块。核心引擎使用 C++ 实现，支持 KernelSU、Magisk 和 APatch，并提供离线 WebUI。

## 核心特性

- 非 VPN 方案：通过 NFQUEUE 处理 DNS、HTTP、TLS 和 QUIC 流量。

- 纯本地引擎：运行时无外部服务依赖，支持自定义 Hosts / AdGuard 规则。

- 快速失败：命中后返回 NXDOMAIN、TCP reset 或 ICMP 不可达，减少应用等待超时。

- 原子更新：规则下载、校验、去重和发布失败时保留当前可用规则。

- 并发同步：默认同时下载 10 个来源，可在“设置 → 规则同步”调整为 1–20。

- 灵活范围：支持全局拦截、按应用拦截、应用白名单和 QUIC 开关。

- 防断网设计：队列冲突拒绝启动，并使用 fail-open、queue-bypass 和链尾兜底。

- 可视化管理：WebUI 支持状态、规则源、应用范围、日志和单源测试。

## 界面预览

手机尺寸截图，使用演示数据。

  概览应用名单
  
    ![](/assets/02adf89df97ab8fc.png)
    ![](/assets/fe6c8b1d5a608a7d.png)
  
  规则管理设置
  
    ![](/assets/e1554c624c32a874.png)
    ![](/assets/da0fb554c60e5678.png)
  

## 环境要求

- Android 12（API 31）及以上。

- arm64-v8a 设备。

- KernelSU、Magisk 或 APatch。

- 内核需支持 NFQUEUE、conntrack、mangle、owner 和 queue-bypass。

Warning

NFQUEUE 0/1 被其他程序占用时，模块会拒绝启动。如已安装 YH_Hosts 或其他同类模块，请先停用、卸载并重启设备。

## 安装与使用

- 从 [Releases](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/releases) 下载最新 ZIP。

- 在根权管理器中刷入模块并重启。

- 打开 WebUI，在“规则”中保存来源，回到概览页执行同步。

- 确认规则正常后手动启动引擎；首次安装默认暂停且不开机自启。

运行数据保存在 `/data/adb/AD_Killer_By_NFQUEUE/`。规则源最多支持 64 个普通 HTTP(S) 地址，默认启用 HaGeZi Pro − Fake 内置来源，可手动停用。

升级保留数据；卸载默认清空本模块规则、名单、日志与下载缓存。卸载失败请按 [ADB 手册](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/ADB%E7%8A%B6%E6%80%81%E6%A3%80%E6%9F%A5%E4%B8%8E%E5%8D%B8%E8%BD%BD%E6%AE%8B%E7%95%99%E6%8E%92%E6%9F%A5.md)核实残留。

在“设置 → 检查更新”中下载校验并确认安装，可选预览版与自动检查；自动检查默认关闭，不自动安装。更新日志读取 GitHub 最新 Release。安装后需手动重启，v1.0 首次升级需在根管理器中手动刷入完整 ZIP。

也可直接在 KernelSU 模块页检查正式版更新，无需打开 WebUI，详见[原生更新说明](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/KernelSU%E5%8E%9F%E7%94%9F%E6%9B%B4%E6%96%B0.md)。

## 本地构建

需要 Android NDK r26+、Node.js 22.12+ / 24 LTS、npm 和 Python 3：

```
NDK=/path/to/android-ndk ./build.sh
python3 tests/verify_checksum.py dist/AD_Killer_By_NFQUEUE-v1.2.7.zip

```

构建产物位于 `dist/`。版本号仅在 [`module/module.prop`](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/module/module.prop) 中维护。
CI 保留正式／预览两套构建产物；公开发布需手动选择全绿 CI 的对应产物，并一次性发布到未使用的新标签，不再覆盖预览附件。详见[模块仓库收录与发布](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/KernelSU%E6%A8%A1%E5%9D%97%E4%BB%93%E5%BA%93%E6%94%B6%E5%BD%95%E4%B8%8E%E5%8F%91%E5%B8%83.md)。

## 测试

```
npm --prefix frontend ci --include=dev
make test

```

主机测试不会修改本机防火墙。需要 root 的真实 NFQUEUE 测试仅应在一次性 Linux 环境执行。

## 文档

- [实现文档](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/AD_Killer_By_NFQUEUE%E5%AE%9E%E7%8E%B0%E6%96%87%E6%A1%A3.md)

- [开源规则合并指南](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E5%BC%80%E6%BA%90%E8%A7%84%E5%88%99%E5%90%88%E5%B9%B6%E6%8C%87%E5%8D%97.md)

- [规则同步预算与缓存](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E8%A7%84%E5%88%99%E5%90%8C%E6%AD%A5%E7%AD%96%E7%95%A5.md)

- [HaGeZi 内置特殊来源](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/HaGeZi%E5%86%85%E7%BD%AE%E7%89%B9%E6%AE%8A%E6%9D%A5%E6%BA%90.md)

- [兼容性与协议限制](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E5%85%BC%E5%AE%B9%E6%80%A7%E4%B8%8E%E5%8D%8F%E8%AE%AE%E9%99%90%E5%88%B6.md)

- [模块更新](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E6%A8%A1%E5%9D%97%E6%9B%B4%E6%96%B0.md)

- [根管理器原生更新提示调研](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E6%A0%B9%E7%AE%A1%E7%90%86%E5%99%A8%E5%8E%9F%E7%94%9F%E6%9B%B4%E6%96%B0%E6%8F%90%E7%A4%BA%E9%80%82%E9%85%8D%E8%B0%83%E7%A0%94.md)

- [ADB 状态检查与卸载残留排查](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/ADB%E7%8A%B6%E6%80%81%E6%A3%80%E6%9F%A5%E4%B8%8E%E5%8D%B8%E8%BD%BD%E6%AE%8B%E7%95%99%E6%8E%92%E6%9F%A5.md)

- [软重启与守护生命周期](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E8%BD%AF%E9%87%8D%E5%90%AF%E4%B8%8E%E5%AE%88%E6%8A%A4%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.md)

- [真机上线审计与验收方案](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E7%9C%9F%E6%9C%BA%E4%B8%8A%E7%BA%BF%E5%AE%A1%E8%AE%A1%E4%B8%8E%E9%AA%8C%E6%94%B6%E6%96%B9%E6%A1%88.md)

- [第三方规则与许可](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/docs/%E7%AC%AC%E4%B8%89%E6%96%B9%E8%A7%84%E5%88%99%E4%B8%8E%E8%AE%B8%E5%8F%AF.md)

## 许可证

项目自有代码使用 [MIT License](https://github.com/fengwenhua/AD_Killer_By_NFQUEUE/blob/f331523d9ec3696e52240728931fd6da7d2a1d99/LICENSE)。第三方库与规则源仍需遵守各自的许可条款。
