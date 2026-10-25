# DSH Skin - Apple Style for DeepSeek

给 DeepSeek 网页版（chat.deepseek.com）套上一层苹果风格的玻璃拟态皮肤。可以换背景、调玻璃透明度和模糊度，设置实时生效并自动保存。

> English documentation: [README_EN.md](README_EN.md)

## 功能

- 苹果风格主题：毛玻璃面板、SF 系统字体栈、iOS 式控件、细滚动条
- 背景更换：10 个预设渐变、自定义图片链接、本地上传图片、一键清除
- 玻璃透明度：10% 到 100% 无级调节
- 背景模糊：0 到 40px 无级调节
- 浅色 / 深色 / 自动跟随系统，三档外观切换
- 设置面板是一个可拖动的悬浮球，所有设置保存在浏览器本地
- 不发起任何网络请求，不上传任何数据

## 安装

### 方式一：Chrome / Edge 扩展（开发者模式）

1. 下载本仓库，解压到一个固定目录
2. 打开浏览器扩展管理页：地址栏输入 `chrome://extensions`（Edge 是 `edge://extensions`）
3. 右上角打开「开发者模式」
4. 点击「加载已解压的扩展程序」，选择本目录（含 manifest.json 的那一层）
5. 打开 chat.deepseek.com，右下角会出现调色盘悬浮球

### 方式二：Tampermonkey 油猴脚本

1. 浏览器装好 Tampermonkey 扩展
2. 点击 Tampermonkey 图标 → 添加新脚本
3. 删除模板内容，粘贴 `dsh-skin.user.js` 的全部内容，保存（Ctrl+S）
4. 打开 chat.deepseek.com 即可

### 方式三：DeepSeek Harness 桌面应用插件（Cordis）

1. 打开 DeepSeek Harness 的「插件」页面，点击右上角「添加插件」
2. 插件地址填写完整的 HTTPS 地址（注意必须带 `https://` 前缀，否则 pnpm 会报 unsupported protocol）：

   ```
   https://github.com/opsyang2076-cloud/DSH-Skin.git
   ```

3. 安装完成后插件会出现在插件列表中，启用即可
4. 打开聊天界面，右下角出现调色盘悬浮球，点击进入设置面板

原理：本包按官方组合包（bundle）规范声明了 `dsh.bundle.patch` 与 `dsh.client`。宿主半边（index.js）是空实现；客户端半边（client.js）通过 `window.__ModuleLoader__` 注册进 Web 客户端，注入玻璃拟态样式和悬浮球设置面板，并用 `ctx.effect` 管理样式的生命周期（禁用插件时自动移除）。

## 使用

页面右下角有一个调色盘悬浮球，点击打开设置面板：

| 设置项 | 说明 |
|---|---|
| 启用皮肤 | 总开关，关掉即恢复 DeepSeek 原版外观 |
| 外观 | 浅色 / 深色 / 自动（跟随系统） |
| 预设背景 | 10 个渐变色板，点选即用 |
| 图片链接 | 粘贴 https 开头的图片地址后点「应用」 |
| 上传本地图片 | 超过 4MB 可能存不下，建议压缩后上传 |
| 玻璃透明度 | 数值越低越通透，默认 72% |
| 背景模糊 | 0 为不模糊，默认 20px |
| 恢复默认 | 重置全部设置（悬浮球位置保留） |

悬浮球按住可以拖到任意位置，位置会记住。

## 目录结构

```
DSH-Skin/
├── index.js             # Cordis 组合包宿主入口（空实现）
├── client.js            # 客户端模块：注入样式 + 悬浮球面板（由脚本生成）
├── cordis.patch.yml     # 组合包补丁：向配置树插入 dsh-skin 插件行
├── icon.svg             # 插件图标
├── lib/                 # 客户端源码
│   ├── page.css         #   玻璃拟态主题 + 面板样式
│   └── page.js          #   悬浮球设置面板逻辑
├── scripts/
│   └── build-client.mjs #   把 lib/ 内联打包成 client.js
├── manifest.json        # Chrome 扩展清单（Manifest V3，可选形态）
├── styles.css           # 主题样式（Chrome 扩展版）
├── content.js           # 设置面板逻辑（Chrome 扩展版）
├── dsh-skin.user.js     # 油猴单文件版
├── icons/               # Chrome 扩展图标
├── LICENSE              # MIT
├── README.md            # 本文件
└── README_EN.md         # 英文说明
```

## 已知限制

- DeepSeek 前端使用哈希类名且会不定期改版，如果哪天皮肤失效，多半是页面结构变了。皮肤用结构化选择器（aside、header、class 包含匹配）来降低这种风险，但无法完全避免。遇到失配可以提 issue。
- 本地上传的大图以 dataURL 形式存在 localStorage，受浏览器约 5MB 配额限制，超限会弹出提示，改用图片链接即可。
- 扩展版和油猴版使用同一个 localStorage 键，同一个浏览器里二选一安装即可，同时装会互相覆盖设置。

## 自定义主题

想改颜色、圆角、字体，编辑 `styles.css` 顶部的 `:root` 变量块即可，所有视觉参数都集中在那里。油猴版对应 `dsh-skin.user.js` 顶部的 `GM_CSS` 模板。

## 许可

MIT，详见 [LICENSE](LICENSE)。
