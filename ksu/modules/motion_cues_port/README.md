# 晕动舒缓显示 · 欧加通用模块

[![](/assets/2b3d54d34316d7b0.svg)](https://github.com/yibgt/oplus-antidizzy-module/actions/workflows/build.yml)

给**缺少「晕动舒缓显示」的 OPPO / 一加 / realme（欧加）ColorOS 机型**补全原生功能。

基于 KernelSU + LSPosed。圆点由**原厂 `AntiDizzyView` 绘制**，模块只做三件事：解开被隐藏的特性开关、用手机自带传感器替代缺失的车辆传感器、给原厂圆点补上边缘抗锯齿。

**⬇️ 下载**：[GitHub Releases 最新版](https://github.com/yibgt/oplus-antidizzy-module/releases/latest) —— 下载 `oplus-antidizzy-module-vX.Y.zip` 刷入 KernelSU 即可，无需自行构建。

## 为什么需要它

ColorOS 16 的「晕动舒缓显示」（设置 → 辅助功能）会在屏幕两侧绘制一列随车辆运动反向滑动的圆点，缓解坐车看屏幕的晕动感。但这功能被机型白名单锁死，名单外的机器设置里开关是灰的。

拆包对比后发现：**固件里这套实现本来就是完整的**——`oplus-services.jar` 里 `AntiDizzyManager` / `AntiDizzyView` / `AntiDizzyMotionAlgorithm` 全都在，Settings 的设置页和预览动画也在。缺的只有两样：

缺什么
性质
模块怎么办

`com.oplus.features_config.xml` 里的一行 `<oplus-feature name="oplus.hardware.display.motion_sickness"/>`
软件门控
开机自动探测并 bind mount 补上

两颗 OPPO 私有传感器 `33171091`(car motion) / `33171092`(car scene)
硬件差异
LSPosed 注入 system_server，用标准传感器喂数据

## 特点

**适配**

- 开机探测 7 个候选配置路径，不写死机型

- 原厂已有 car motion / car scene 传感器 → **自动退出不注入**，对原生支持的机型零影响

- 传感器逐项降级：线性加速度 → 加速度计去重力；有重力传感器才算振动方向；无陀螺也能跑

- 类名 / 字段名 / 方法名多套备选，跨版本兼容

**算法**

- 车辆识别用五维特征（振动能量、1–6Hz 低频占比、重力方向占比、陀螺 RMS、步频自相关），陀螺是**否决**条件而非触发条件，另加 8 秒手持抑制

- **纵向独立增益**：原厂算法对 X/Y 完全对称，但车辆加减速的物理信号天然比转弯侧向弱好几倍——纵向独立放大（默认 2.5×），前后摆动观感与转弯一致

- **静止噪声门限**：抑制竖持手机时重力补偿泄漏与手持缓晃导致的圆点漂移，车内大信号无损通过

- 圆点抗锯齿用 `fwidth` 按像素计算过渡宽度，**任何分辨率 / DPI / 球尺寸都是 1px 过渡，零配置**

抗锯齿前后对比（放大 10 倍）：

![](/assets/a2c0ffe46b2e3b05.png)

## 安装

- 从 [**Releases 最新版**](https://github.com/yibgt/oplus-antidizzy-module/releases/latest) 下载 `oplus-antidizzy-module-vX.Y.zip`，在 KernelSU 中安装 → 重启

- 打开 **LSPosed** → 模块 → 勾选 **AntiDizzy Bridge** → 作用域只勾 **系统框架** → 重启

- 设置 → 辅助功能 → 晕动舒缓显示 → 开启

- 第 2 步必须手工做：LSPosed 的配置是 SQLite 库，KernelSU 写不了，这是整个流程里唯一需要动手的地方

- 更新模块后需**整机重启**（`pm install` 会改变 APK 路径，而 LSPosed 在 zygote 里缓存旧路径）

- 模块更新时不会触发 `uninstall.sh`，可以放心覆盖安装

## 使用

**第一步（只需一次）：** 打开 KernelSU 管理器 → 模块 → 晕动舒缓显示 → WebUI，设置好灵敏度、前后向增强、静止门限、显示模式与车辆识别参数：

![](/assets/1209f12eb782ad77.png)

**日常使用：** 直接用**系统原生的操作开关**即可——设置 → 辅助功能 → 晕动舒缓显示。模块的所有参数都保存在系统 Settings 里，原生设置页的开关/模式选择与 WebUI 写的是同一组键，两边完全互通、实时生效：

![](/assets/724cd7cad973be5d.png)

上图即系统原生「晕动舒缓显示」设置页：总开关控制功能启停，「常驻显示 / 仅车辆运动时显示」切换模式。WebUI 负责一次性的参数调校，日常开关交给系统原生界面。

## 卸载

在 KernelSU 里删除模块即可，模块会自己收拾干净：

- `uninstall.sh` 在删除瞬间卸载 APK（同时停掉注入）、删除写入的 Settings 键、**立即 umount** 三个 bind mount、清理临时文件

- 另有一个「墓碑」脚本放在 `/data/adb/service.d/`，万一 `uninstall.sh` 没跑成，下次开机会补做并自删

分区文件全程未被修改（只读 EROFS + bind mount 覆盖），`umount` 后即为原样。

## 更新日志

### v7.4

- 布局回归紧凑：选项行 56dp、上下内距 12dp、组标题与滑杆间距收紧，信息密度更高

- 卡片圆角由 16dp 加大到 **20dp**（仍为 squircle 平滑圆角），边角更圆润

### v7.3

**WebUI 按 miuix 官方源码规范全面重构**（compose-miuix-ui/miuix，1.6k★）

- 颜色、字体、组件尺寸逐项对齐源码：`Colors.kt` 全部色值（含 `sliderBackground` 6% 黑轨道）、`TextStyles.kt` 字号表、`SmallTitle` 内边距 28dp、`Button` 17sp、`Slider` 左右留白 14dp（thumbRadius）

- **移除滑块与开关的阴影**——官方 `drawCircle` 为纯实心绘制，无投影

- 卡片 16dp / 弹窗 32dp 采用 **squircle 超椭圆平滑圆角**（`corner-shape`，对应 miuix-squircle）

- 新增 miuix 交互反馈：滑杆拖拽时轨道叠加 4.4% 黑蒙版、列表行按压 Sink 下沉（scale .985）

- 列表去掉选项间分割线，行高提升至 64dp、上下内距 16dp，更符合 miuix「留白即分隔」的呼吸节奏

### v7.1

- **修复：竖持静止时圆点因重力漂移**。竖持时重力在 X/Y 投影大，线性加速度计的重力补偿在缓慢倾斜时会泄漏毫级伪加速度，叠加手持缓晃后被前置增益放大、越过原厂 0.196 m/s² 死区，表现为"明明没动圆点却在漂"。

- 新增**静止噪声门限** `motion_cues_gate`（默认 0.08，0=关闭）：快包络（τ≈0.1s）跟踪每轴幅度，持续低于门限的轴清零——手持漂移被抑制，车内转弯/加减速等大信号瞬间越过门限、几乎无损。

- WebUI 灵敏度卡新增「静止门限」滑杆（0~0.30，拖到最左关闭）；测试模式新增「竖持漂移」模拟（模式 5，圆点应纹丝不动）。

- 卸载清理补 `motion_cues_gate` 键。

### v7.0（相对 v5.x 的完整变化）

**KernelSU WebUI 控制面板（v6.0 新增）**

- 免 PC 调参：KernelSU 管理器内直接调节灵敏度、显示模式、车辆识别阈值、测试模式，改动约 2 秒生效

- 新增「晕动舒缓显示」总开关、一键恢复默认参数

**HyperOS 风格 UI（v6.1 ~ v6.4）**

- WebUI 按官方开源 miuix 项目（compose-miuix-ui/miuix）源码 1:1 复刻：颜色、字体、圆角、组件尺寸全部取自源码 token

- 复刻折叠大标题顶栏（毛玻璃）、49×28 开关、28dp 胶囊滑杆（圆头包裹滑块）、单选行、miuix 弹窗

- 浅色/深色双主题跟随系统

**纵向独立增益（v6.5，算法）**

- 逆向原厂 `AntiDizzyMotionAlgorithm` 确认 X/Y 处理完全对称（死区 0.196 m/s²、低通 0.05、速度 =|a|×12 封顶 40）

- 前后向迟钝的根源是物理信号差：转弯侧向 1~3 m/s²，加减速仅 0.3~0.8 m/s²，被死区+低通二次衰减

- 新增 `motion_cues_gain_y`（默认 2.5×）独立放大纵向信号，转弯路径不动；车辆识别仍吃原始数据

**v7.0**：整合以上全部改进的稳定里程碑，无破坏性变更。

## 兼容性

系统
状态

ColorOS 16（Android 16）
✅ 主力适配与验证

ColorOS 15 及更早
⚠️ 若固件内含 AntiDizzy 实现理论可用，未验证

ColorOS 17
⚠️ 未验证。模块对包名 `com.android.server.display.feature.antidizzy` 是硬依赖，厂商重构则失效；失效表现为「不生效」而非崩溃

**前提**：`oplus-services.jar` 里必须有 `com.android.server.display.feature.antidizzy.*`。完全没有这套代码的老机型，模块无能为力（日志会打印「找不到 AntiDizzyManager」）。

## 已知限制

- `car scene` 是**行为近似**。原厂判断的是"场景"（可能融合车机连接、GPS、地磁），本模块判断的是"振动特征"。公交/地铁上可能与原厂有差异。

- 抗锯齿依赖 `GL_OES_standard_derivatives`（GLES2 可选项，实际支持率接近 100%）；不支持时退化为固定宽度平滑。

- LSPosed 作用域需手动勾选。

## 构建

需要 JDK 17+、Android build-tools、`android.jar`（API 33+）：

```
export ANDROID_JAR=$ANDROID_HOME/platforms/android-36/android.jar
export BUILD_TOOLS=$ANDROID_HOME/build-tools/35.0.0

./build/build-apk.sh      # 编译 LSPosed 模块 → dist/AntiDizzyBridge.apk
./build/build-module.sh   # 打包成可刷入的模块 zip → dist/*.zip

```

`aapt2` 不支持非 ASCII 路径，项目必须放在纯英文目录下。构建脚本会提前检查并提示。

## 项目结构

```
module/            KernelSU 模块（module.prop + 四个脚本）
  post-fs-data.sh    探测并 patch 特性配置，bind mount
  service.sh         安装桥接 APK、部署卸载墓碑
  cleanup.sh         清理逻辑（uninstall.sh 与墓碑共用）
  uninstall.sh       模块被删除时执行
xposed/            LSPosed 模块源码
  src/               Bridge.java（注入与调度）、VehicleDetector.java（车辆识别）
  stub/              Xposed API 编译期桩（不进 dex，运行时由 LSPosed 提供）
  assets/xposed_init 入口声明
build/             构建脚本
dist/              本地构建输出（不入库，从 Releases 下载）
docs/              技术文档、论坛文案、截图
tools/dalvik.py    DEX 反汇编工具（逆向时用）

```

## 文档

- [技术文档](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/docs/technical-notes.md)：完整的逆向结论、算法原理、调试命令、调参表

- [维护与发布](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/docs/RELEASING.md)：日常改动、发版流程、CI 与签名密钥说明

- [论坛文案（精简）](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/docs/promo-short.md) / [（详细）](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/docs/promo-detailed.md) / [（v7.1 发布版）](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/docs/promo-v7.md)

## 免责声明

本项目通过逆向分析实现功能补全，**未包含或分发任何来自 OPPO 的代码或资源**。所有绘制与算法均调用设备固件中已有的原厂实现。

涉及 root、KernelSU、LSPosed 操作，刷机有风险。模块只做配置文件 bind mount 和 system_server 内的传感器数据注入，不改动任何分区内容。请自行评估风险。

## License

[MIT](https://github.com/MieAiiii/oplus-antidizzy-module/blob/d7e106548b532b73518d3de5badffe4b72efbef5/LICENSE)
