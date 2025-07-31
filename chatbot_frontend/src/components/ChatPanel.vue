<template>
  <el-container class="chat-container">
    <el-main class="chat-main">
      <div class="chat-history" ref="historyDiv">
        <div
          class="chat-message"
          v-for="(msg, idx) in history"
          :key="idx"
          :class="msg.sender"
        >
          <span class="sender">{{ msg.sender === 'user' ? 'You' : 'Bot' }}</span>:
          <span class="content">{{ msg.content }}</span>
          <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div v-if="pendingBot" class="chat-message bot loading">
          <span class="content">Bot is typing...</span>
        </div>
      </div>
      <el-form class="chat-input-form" @submit.prevent="onSend">
        <el-input
          v-model="input"
          placeholder="Type your message..."
          :disabled="sending"
          @keyup.enter="onSend"
          clearable
          autofocus
        ></el-input>
        <el-button
          type="primary"
          :disabled="input.length === 0 || sending"
          @click="onSend"
        >Send</el-button>
      </el-form>
      <el-alert
        v-if="error"
        type="error"
        :closable="false"
        effect="light"
        :title="error"
        style="margin-top: 10px;"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { sendMessage, fetchChatHistory } from '@/composables/useChat'
import type { ChatMessage } from '@/composables/useChat'
const input = ref('')
const history = ref<ChatMessage[]>([])
const sending = ref(false)
const error = ref<string | null>(null)
const pendingBot = ref(false)
const historyDiv = ref<HTMLElement | null>(null)

onMounted(async () => {
  await fetchChatHistory((msgs: ChatMessage[]) => { history.value = msgs })
  await nextTick(() => scrollToBottom())
})

function scrollToBottom() {
  if (historyDiv.value) {
    historyDiv.value.scrollTop = historyDiv.value.scrollHeight
  }
}

function formatTime(ts?: string) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString()
}

async function onSend() {
  if (!input.value.trim()) return
  error.value = null
  sending.value = true
  pendingBot.value = true
  await sendMessage(
    input.value,
    (msg: ChatMessage) => {
      history.value.push(msg)
      input.value = ''
    },
    (msg: ChatMessage) => {
      history.value.push(msg)
      pendingBot.value = false
      nextTick(() => scrollToBottom())
    }
  )
  sending.value = false
  scrollToBottom()
}
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  background: #fff;
}
.chat-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 3rem 2rem 2rem 2rem;
}
.chat-history {
  flex: 1 1 0;
  overflow-y: auto;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  max-height: 60vh;
  background: #fcfcfc;
  border-radius: 10px;
  border: 1px solid #eee;
}
.chat-message {
  margin: 12px 0;
  padding: 10px 16px;
  border-radius: 10px;
}
.chat-message.user {
  background: #e8f4fd;
  align-self: flex-end;
  text-align: right;
}
.chat-message.bot {
  background: #f5f5f5;
  align-self: flex-start;
}
.sender {
  font-weight: bold;
  margin-right: 8px;
}
.timestamp {
  color: #888;
  font-size: 11px;
  margin-left: 8px;
}
.chat-input-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.loading .content {
  color: #1976d2;
}
</style>
