# 破茧实验 1 - B站标题抓取插件

这是你的第一个浏览器插件，用于抓取 Bilibili 首页的视频标题并打印到浏览器控制台。

## 插件文件结构
```
chrome-extension-exp1/
├── manifest.json   # 插件配置文件
└── content.js      # 内容脚本（负责抓取数据）
```

## 如何安装到 Chrome/Edge

1.  **打开扩展程序页面**：
    在浏览器地址栏输入：
    - Chrome: `chrome://extensions/`
    - Edge: `edge://extensions/`

2.  **开启开发者模式**：
    点击右上角的 **"开发者模式" (Developer mode)** 开关。

3.  **加载插件**：
    点击 **"加载已解压的扩展程序" (Load unpacked)**，选择 `chrome-extension-exp1` 文件夹。

## 如何测试

1.  **打开 Bilibili 首页**：
    访问 `https://www.bilibili.com/`

2.  **打开浏览器控制台**：
    按 `F12` 或右键点击页面选择 **"检查" (Inspect)**。

3.  **查看结果**：
    在控制台 (Console) 标签页中，你会看到：
    ```
    === 破茧实验 1：B站标题抓取插件已加载 ===
    
    🎬 成功抓取 X 个视频标题：
    ----------------------------------------
    1. xxx
    2. xxx
    3. xxx
    ...
    ----------------------------------------
    ```

## 代码说明

*   **manifest.json**: 告诉浏览器这是一个插件，以及它要在哪个网站上运行。
*   **content.js**: 注入到 B 站网页的脚本。
    *   使用 `document.querySelectorAll()` 查找视频标题元素。
    *   使用 `MutationObserver` 监听页面变化，当你滚动页面加载新视频时，它会自动重新抓取。

---

恭喜！你完成了第一个“破茧”相关的小实验！下一步可以尝试把这些标题发送给 AI 进行分析。
