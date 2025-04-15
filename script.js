const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';

  appendMessage('bot', 'Pensando...');

  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (data.reply) {
      updateLastBotMessage(data.reply);
    } else {
      updateLastBotMessage('No hubo respuesta del modelo.');
    }

  } catch (error) {
    updateLastBotMessage('Error al conectar con el servidor.');
    console.error(error);
  }
});

function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = text;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateLastBotMessage(text) {
  const messages = document.querySelectorAll('.bot-message');
  const lastMessage = messages[messages.length - 1];
  if (lastMessage) lastMessage.textContent = text;
}
