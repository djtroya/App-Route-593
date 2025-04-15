document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('input');
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Error en la respuesta del servidor:', data);
      addMessage('Error del modelo: ' + (data.error?.message || 'Respuesta no válida.'), 'bot');
      return;
    }

    addMessage(data.reply, 'bot');

  } catch (err) {
    console.error('Error de red o ejecución:', err);
    addMessage('No se pudo conectar con el modelo. Intenta más tarde.', 'bot');
  }
});

function addMessage(text, sender) {
  const container = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(sender);
  messageDiv.textContent = text;
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}
