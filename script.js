function enviarSolicitud() {
  const ubicacion = document.getElementById('ubicacion').value;
  const destino = document.getElementById('destino').value;

  if (!ubicacion || !destino) {
    alert('Por favor, completa ambos campos.');
    return;
  }

  document.getElementById('respuesta').innerText = 'Procesando solicitud...';

  fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ubicacion, destino })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    return response.json();
  })
  .then(data => {
    if (data.respuesta) {
      document.getElementById('respuesta').innerText = data.respuesta;
    } else {
      document.getElementById('respuesta').innerText = 'No se recibió una respuesta válida de la IA.';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('respuesta').innerText = 'Ocurrió un error al procesar la solicitud.';
  });
}
