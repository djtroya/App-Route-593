document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('input');
  const message = input.value.trim();
  if (!message) return;

  showMessage(message, 'user');
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
      console.error('Error del servidor:', data.error);
      showMessage('Error del modelo: ' + (data.error?.message || 'Desconocido'), 'bot');
      return;
    }

    showMessage(data.reply, 'bot');

  } catch (err) {
    console.error('Error de red o ejecución:', err);
    showMessage('No hubo respuesta del modelo (error de red).', 'bot');
  }
});

function showMessage(text, sender) {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = sender;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
