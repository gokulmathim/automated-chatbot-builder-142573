import { ref, computed, type Ref } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

interface User {
  username: string
  [key: string]: unknown
}

// Store auth state in memory (could use localStorage or cookies for persistence)
const user: Ref<User | null> = ref(null)
const isAuthenticated = computed(() => !!user.value)
const loading = ref(false)
const error = ref<string | null>(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

/**
 * Login user using Django backend API.
 * @param username
 * @param password
 */
async function login(username: string, password: string): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    const response: AxiosResponse<{ user?: User }> = await axios.post(`${API_BASE}/login/`, { username, password }, { withCredentials: true })
    user.value = response.data.user || { username }
    return true
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.detail || 'Login failed'
    } else {
      error.value = 'Login failed'
    }
    user.value = null
    return false
  } finally {
    loading.value = false
  }
}

/**
 * Registers a new user.
 * @param username
 * @param password
 */
async function register(username: string, password: string): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    await axios.post(`${API_BASE}/register/`, { username, password }, { withCredentials: true })
    // Auto login after register (optional)
    await login(username, password)
    return true
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.detail || 'Registration failed'
    } else {
      error.value = 'Registration failed'
    }
    return false
  } finally {
    loading.value = false
  }
}

/**
 * Logout current user session.
 */
async function logout(): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    await axios.post(`${API_BASE}/logout/`, {}, { withCredentials: true })
    user.value = null
    return true
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.detail || 'Logout failed'
    } else {
      error.value = 'Logout failed'
    }
    return false
  } finally {
    loading.value = false
  }
}

/**
 * Load chat history for authenticated user.
 */
async function getChatHistory(): Promise<unknown[]> {
  try {
    const response: AxiosResponse<unknown[]> = await axios.get(`${API_BASE}/history/`, { withCredentials: true })
    return response.data
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.detail || 'Failed to fetch history'
    } else {
      error.value = 'Failed to fetch history'
    }
    return []
  }
}

export function useAuth() {
  // PUBLIC_INTERFACE
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getChatHistory,
  }
}
