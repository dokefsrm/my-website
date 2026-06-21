---
title: Git 起步
order: 1
description: 安装 Git，配置用户信息，理解 Git 的三个区域，完成第一次提交。
---

<script setup>
import TutorialNav from '../../.vitepress/theme/components/TutorialNav.vue'
</script>

# Git 起步

## 安装 Git

**Windows**: 从 [git-scm.com](https://git-scm.com/) 下载安装包，一路 Next 即可。

**macOS**: `brew install git`

**Linux**: `sudo apt install git` (Ubuntu) 或对应包管理器。

验证安装：

```bash
git --version
# git version 2.47.0
```

## 初次配置

```bash
git config --global user.name "你的名字"
git config --global user.email "your@email.com"
```

## Git 的三个区域

理解 Git 的核心是理解这三个区域：

```
工作目录          暂存区          本地仓库
(Working Dir) → (Staging)  →  (Local Repo)
     │                               │
     │    git add                    │    git commit
     └───────────────────────────────┘
```

| 命令 | 作用 |
|------|------|
| `git add` | 工作目录 → 暂存区 |
| `git commit` | 暂存区 → 本地仓库 |
| `git status` | 查看当前状态 |
| `git log` | 查看提交历史 |

## 第一次提交

```bash
# 初始化仓库
mkdir my-project && cd my-project
git init

# 创建文件
echo "# My Project" > README.md

# 查看状态
git status

# 添加到暂存区
git add README.md

# 提交
git commit -m "初始化项目"

# 查看历史
git log --oneline
```

## 常用技巧

- `.gitignore` — 忽略不需要追踪的文件
- `git diff` — 查看具体改了什么
- 提交信息用**中文或英文**都可以，关键是**描述做了什么**

<TutorialNav
  :prev="undefined"
  :next="{ text: '02. 分支与协作', link: '/tutorials/git-guide/02-branch' }"
  :seriesChapters="[
    { title: '系列介绍', link: '/tutorials/git-guide/', order: 0 },
    { title: '01. Git 起步', link: '/tutorials/git-guide/01-start', order: 1 },
    { title: '02. 分支与协作', link: '/tutorials/git-guide/02-branch', order: 2 },
  ]"
/>
