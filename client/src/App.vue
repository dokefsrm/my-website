<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import AppHeader from './components/AppHeader.vue'

const auth = useAuthStore()
onMounted(() => auth.checkAuth())
</script>

<template>
  <AppHeader />
  <router-view />
</template>
