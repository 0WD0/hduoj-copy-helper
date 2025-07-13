# HDU OJ Copy Helper

一个为 HDUOJ 比赛页面添加复制按钮的油猴脚本。

## 功能特点

✨ **一键复制题目内容** - 为所有题目内容区块添加复制按钮  
📝 **支持 LaTeX 数学公式** - 正确复制包含数学公式的内容  
🎨 **原生样式** - 使用与页面一致的复制按钮样式  
⚡ **智能复制** - 自动处理 Markdown 格式和纯文本  

## 安装方法

### 前提条件
确保你已经安装了以下浏览器扩展之一：
- [Tampermonkey](https://tampermonkey.net/) （推荐）
- [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)
- [Violentmonkey](https://violentmonkey.github.io/)

### 安装步骤
1. 点击 [hduoj-copy-helper.user.js](./hduoj-copy-helper.user.js) 下载脚本
2. 浏览器会自动识别并提示安装
3. 在扩展的安装界面点击"安装"

## 使用方法

1. 访问 HDU OJ 的比赛题目页面（例如：`http://acm.hdu.edu.cn/contest/problem?cid=xxx&pid=xxx`）
2. 在每个题目内容区块的右上角会出现一个复制按钮 📋
3. 点击复制按钮即可复制该区块的内容
4. 复制的内容会保持正确的 Markdown 格式，包括数学公式

## 支持的内容区块

- **Problem Description** - 题目描述
- **Input** - 输入格式说明
- **Output** - 输出格式说明  
- **Sample Input** - 样例输入
- **Sample Output** - 样例输出
- **Hint** - 提示信息
