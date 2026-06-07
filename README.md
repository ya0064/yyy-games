# 🎮 丫丫游戏仓库

基于 Jekyll + GitHub Pages 构建的静态游戏网站。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 访问 http://localhost:4000
```

### 部署到 GitHub Pages

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/ya0064/yyy-games.git

# 推送到 GitHub
git push -u origin main
```

然后在 GitHub 仓库 Settings → Pages 中：
1. Source 选择 "Deploy from a branch"
2. Branch 选择 `main` / `root`
3. 点击 Save

等待几分钟，你的网站就会上线！

## 🌐 自定义域名

在仓库 Settings → Pages → Custom domain 中添加你的域名 `bububuga.cc.cd`

然后在你的域名服务商处添加 DNS 记录：

| 类型 | 主机记录 | 值 |
|-----|--------|-----|
| CNAME | www | ya0064.github.io |
| CNAME | @ | ya0064.github.io |

或者使用 A 记录指向 GitHub IP：
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

## 📁 目录结构

```
games/
├── _posts/           # 游戏文章（Markdown格式）
├── _layouts/         # 页面模板
├── _includes/        # 可复用组件
├── assets/           # CSS、JS、图片
│   ├── css/
│   └── js/
├── _config.yml       # Jekyll配置
├── index.html        # 首页
├── about.md          # 关于页面
├── Gemfile           # Ruby依赖
└── README.md         # 说明文档
```

## ✨ 功能特点

- 🎨 深色游戏主题风格
- 📱 完全响应式设计
- 🔍 内置搜索功能
- 🏷️ 分类和标签系统
- 📄 SEO 优化
- 🌐 自定义域名支持
- 🔒 免费 HTTPS

## 📝 添加新游戏

在 `_posts/` 目录下创建新的 Markdown 文件：

```markdown
---
layout: post
title: "游戏名称"
category: "动作冒险"
date: "2026-06-07"
tags:
  - 标签1
  - 标签2
version: "v1.0"
size: "10GB"
language: "简体中文"
---

# 游戏介绍内容...

## 系统需求

## 下载说明
```

文件命名格式：`年-月-日-游戏名称.md`

## 🔧 技术栈

- **Jekyll 4.3** - 静态网站生成器
- **GitHub Pages** - 免费托管
- **CSS3** - 自定义深色主题
- **Vanilla JS** - 无依赖

## 📄 许可证

本项目仅供学习和交流使用。游戏版权归属各自发行商。

---

**官方网站：** https://bububuga.cc.cd  
**GitHub：** https://github.com/ya0064/yyy-games