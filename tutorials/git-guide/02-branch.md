---
title: 分支与协作
order: 2
description: 掌握 Git 分支管理，学会合并和解决冲突，了解团队协作流程。
---

<script setup>
import TutorialNav from '../../.vitepress/theme/components/TutorialNav.vue'
</script>

# 分支与协作

## 什么是分支？

分支让你可以在**不影响主线**的情况下开发新功能或修复 bug。

```
main ──●──●──●
            \
feature ────●──●
```

## 分支操作速查

```bash
# 创建分支
git branch feature-login

# 切换分支
git switch feature-login
# 或：git checkout feature-login

# 创建 + 切换（一步到位）
git switch -c feature-new

# 查看所有分支
git branch -a

# 删除分支
git branch -d feature-login
```

## 合并分支

当功能开发完成，合并回主分支：

```bash
# 1. 先切回目标分支
git switch main

# 2. 合并
git merge feature-login
```

### 合并冲突怎么办？

当两个分支修改了同一文件的同一行时，Git 无法自动合并：

```
<<<<<<< HEAD
这是 main 分支的版本
=======
这是 feature 分支的版本
>>>>>>> feature-login
```

**解决步骤**：
1. 手动编辑文件，保留需要的代码
2. 删除 `<<<` `===` `>>>` 标记
3. `git add` 标记已解决
4. `git commit` 完成合并

## 团队协作流程

### 常用分支策略

```
main        ──●────────●──────────●──  (稳定发布)
                \
release/1.0 ────●──●──●                (发布候选)
                      \
dev           ────●───●──●──●──●       (开发主线)
                       \
feature/xxx          ──●──●            (功能开发)
```

### 标准流程

1. 从 `dev` 拉出 feature 分支
2. 开发 + 提交
3. 推送 feature 分支
4. 创建 Pull Request
5. Code Review
6. 合并到 `dev`

## 💡 最佳实践

- ✅ **一个分支只做一件事**
- ✅ **提交粒度要小** — 每个 commit 做一件事
- ✅ **写清楚的 commit message**
- ❌ 避免直接在 main 上开发
- ❌ 避免一个分支改几十个文件

<TutorialNav
  :prev="{ text: '01. Git 起步', link: '/tutorials/git-guide/01-start' }"
  :next="undefined"
  :seriesChapters="[
    { title: '系列介绍', link: '/tutorials/git-guide/', order: 0 },
    { title: '01. Git 起步', link: '/tutorials/git-guide/01-start', order: 1 },
    { title: '02. 分支与协作', link: '/tutorials/git-guide/02-branch', order: 2 },
  ]"
/>
