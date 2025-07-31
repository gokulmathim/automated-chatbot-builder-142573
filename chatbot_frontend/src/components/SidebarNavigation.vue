<template>
  <el-aside width="220px" class="sidebar">
    <div class="sidebar-header">
      <h2>🤖 Chatbot</h2>
      <div v-if="auth.user.value">
        <p class="username">{{ auth.user.value.username }}</p>
        <el-button type="text" @click="auth.logout()">Logout</el-button>
      </div>
    </div>
    <el-menu class="el-menu-vertical" :default-active="$route.path">
      <el-menu-item index="/">
        <router-link to="/">Chat</router-link>
      </el-menu-item>
      <el-menu-item index="/about">
        <router-link to="/about">About</router-link>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
const auth = useAuth()
const $route = useRoute()
</script>

<style scoped>
.sidebar {
  background: #fafbfc;
  border-right: 1px solid #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem 1rem 1.5rem;
}
.sidebar-header {
  margin-bottom: 2rem;
}
.username {
  font-size: 1.05rem;
  color: #333;
  margin-bottom: 0.5rem;
}
</style>
