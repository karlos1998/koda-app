<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import socketService from '../services/socketService';

const newMessage = ref('Cześć, znajdź mi proszę najbliższy lot do Krakowa z Barcelony');
const messages = ref([]);
const messageQueue = ref([]);
let isTyping = ref(false);

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      sender: 'you',
      text: newMessage.value,
    });

    socketService.sendMessage(newMessage.value);
    newMessage.value = '';
    scrollToBottom();
  }
};

const processQueue = () => {
  if (messageQueue.value.length > 0 && !isTyping.value) {
    const nextMessage = messageQueue.value.shift();
    addMessageWithTypingEffect(nextMessage);
  }
};

const scrollToBottom = () => {
  const messageContainer = document.querySelector('.messages');
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const addMessageWithTypingEffect = (message) => {
  const fullText = message.text;
  let currentText = '';
  const typingSpeed = 2;

  isTyping.value = true;

  const tempMessage = ref({ sender: message.sender, text: '' });
  messages.value.push(tempMessage.value);

  const interval = setInterval(() => {
    if (currentText.length < fullText.length) {
      currentText += fullText[currentText.length];
      tempMessage.value.text = currentText;
      scrollToBottom();
    } else {
      clearInterval(interval);
      isTyping.value = false;
      processQueue();
    }
  }, typingSpeed);
};

onMounted(async () => {
  socketService.connect();

  socketService.onMessage((message) => {
    messageQueue.value.push(message);
    processQueue();
  });

  await nextTick();
  document.getElementById('message-input').focus();
  scrollToBottom();
});

onMounted(() => {
  messageQueue.value.push({
    sender: 'engine',
    text: 'Witaj, jestem chatbotem wyszukującym loty poprzez serpapi. Jak mogę Ci pomóc?',
  });
  processQueue();
});
</script>



<template>
  <div class="chat-container">
    <div class="messages">
      <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{'message-you': message.sender === 'you', 'message-engine': message.sender === 'engine'}"
          class="message"
      >
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <div class="input-container">
      <input
          id="message-input"
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
  height: 90vh; /* 90% wysokości ekranu */
  max-height: 600px;
  max-width: 800px;
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
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.message-you {
  background-color: #d1f5d3;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 10px;
}

.message-engine {
  background-color: #e1e5ea;
  align-self: flex-start;
  margin-right: auto;
  margin-left: 10px;
}

.text {
  color: #333;
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
