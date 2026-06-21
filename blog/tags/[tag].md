---
title: 标签
description: 按标签筛选文章
---

<script setup>
import { useData } from 'vitepress'
import { data } from '../../.vitepress/posts.data.js'

const { params } = useData()
const tag = params.value.tag

const filtered = data.posts.filter(p => p.tags.includes(tag))
</script>

# 🏷️ 标签：{{ tag }}

共 {{ filtered.length }} 篇文章

<BlogList :posts="filtered" />

[← 返回全部文章](/blog/)
