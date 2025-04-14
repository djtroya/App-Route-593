async function enviarMensaje() {
  const input = document.getElementById('user-input');
  const mensaje = input.value.trim();
  if (!mensaje) return;

  agregarMensaje(mensaje, 'usuario');
  input.value = '';

  try {
    const respuesta = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pregunta: mensaje })
    });

    const data = await respuesta.json();

    if (data.respuesta) {
      agregarMensaje(data.respuesta, 'bot');
    } else {
      agregarMensaje('La respuesta del servidor está vacía.', 'bot');
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    agregarMensaje('Hubo un error al procesar tu solicitud.', 'bot');
  }
}

function agregarMensaje(texto, tipo) {
  const chatBox = document.getElementById('chat-box');
  const mensaje = document.createElement('div');
  mensaje.className = tipo === 'bot' ? 'mensaje-bot' : 'mensaje-usuario';
  mensaje.textContent = texto;
  chatBox.appendChild(mensaje);
  chatBox.scrollTop = chatBox.scrollHeight;
}
