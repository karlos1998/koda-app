<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import socketService from '../services/socketService';

const newMessage = ref('');
const messages = ref([]);

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      sender: 'you',
      text: newMessage.value,
    });

    socketService.sendMessage(newMessage.value);
    newMessage.value = '';
  }
};

onMounted(() => {
  socketService.connect();

  socketService.onMessage((message) => {
    messages.value.push(message);
  });
});

onUnmounted(() => {
  // Można dodać logikę rozłączania, jeśli jest potrzebna
});
</script>

<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="sender">{{ message.sender }}:</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <div class="input-container">
      <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.message {
  margin: 5px 0;
}

.sender {
  font-weight: bold;
}

.text {
  color:cadetblue;
  white-space: pre-line;
}

.input-container {
  display: flex;
  align-items: center;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
