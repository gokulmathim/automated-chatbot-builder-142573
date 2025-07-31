<template>
  <el-form
    class="register-form"
    label-width="80px"
    @submit.prevent="onSubmit"
    :model="{ username, password }"
  >
    <el-form-item label="Username">
      <el-input v-model="username" autocomplete="username" autofocus />
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="password" type="password" autocomplete="new-password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="loading">Register</el-button>
      <el-button type="text" @click="$emit('switch-login')">Back to Login</el-button>
    </el-form-item>
    <el-alert v-if="error" :title="error" type="error" show-icon />
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
defineEmits(['switch-login'])
const auth = useAuth()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  const success = await auth.register(username.value, password.value)
  error.value = auth.error.value
  loading.value = false
  if (success) {
    window.location.reload()
  }
}
</script>

<style scoped>
.register-form {
  max-width: 350px;
  margin: auto;
  padding: 3rem 2rem 2rem 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(60, 60, 130, 0.08);
}
</style>
