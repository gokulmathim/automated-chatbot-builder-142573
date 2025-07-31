import { ref } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

export interface ChatMessage {
  id?: number
  sender: 'user' | 'bot'
  content: string
  timestamp?: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const sending = ref(false)
const sendError = ref<string | null>(null)

// Fetch initial history
export async function fetchChatHistory(setHistory: (messages: ChatMessage[]) => void) {
  try {
    const response: AxiosResponse<ChatMessage[]> = await axios.get(`${API_BASE}/history/`, { withCredentials: true })
    setHistory(response.data)
  } catch {
    // ignore fetch error
  }
}

/**
 * Send a message to the backend, get auto response, append both to chatHistory.
 */
export async function sendMessage(
  message: string,
  onMessage: (msg: ChatMessage) => void,
  onBotResponse: (msg: ChatMessage) => void
): Promise<ChatMessage | undefined> {
  sending.value = true
  sendError.value = null
  try {
    // Add user message locally
    const userMsg: ChatMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    onMessage(userMsg)

    // Post to backend
    const response: AxiosResponse<{ reply?: string; message?: string; response?: string; }> = await axios.post(
      `${API_BASE}/message/`,
      { message },
      { withCredentials: true }
    )
    const botMsg: ChatMessage = {
      sender: 'bot',
      content:
        response.data.reply ||
        response.data.message ||
        response.data.response ||
        'Bot response',
      timestamp: new Date().toISOString(),
    }
    onBotResponse(botMsg)
    return botMsg
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      sendError.value = err.response?.data?.detail || 'Message failed'
    } else {
      sendError.value = 'Message failed'
    }
  } finally {
    sending.value = false
  }
}
