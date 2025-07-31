<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SidebarNavigation from '@/components/SidebarNavigation.vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import { useAuth } from '@/composables/useAuth'
import 'element-plus/dist/index.css'

const auth = useAuth()
const showRegister = ref(false)

function switchRegister() { showRegister.value = true }
function switchLogin() { showRegister.value = false }
</script>

<template>
  <el-container class="app-root">
    <SidebarNavigation />
    <el-container class="main-panel">
      <div v-if="!auth.isAuthenticated.value">
        <LoginForm v-if="!showRegister" @switch-register="switchRegister" />
        <RegisterForm v-else @switch-login="switchLogin" />
      </div>
      <div v-else>
        <RouterView />
      </div>
    </el-container>
  </el-container>
</template>

<style>
.app-root {
  height: 100vh;
  background: #f5f8fb !important;
}
.main-panel {
  background: #fff;
  flex: 1;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
