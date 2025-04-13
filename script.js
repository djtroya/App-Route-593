function enviarSolicitud() {
  const ubicacion = document.getElementById('ubicacion').value;
  const destino = document.getElementById('destino').value;

  if (!ubicacion || !destino) {
    alert('Por favor, completa ambos campos.');
    return;
  }

  // Mostrar mensaje de carga
  document.getElementById('respuesta').innerText = 'Procesando solicitud...';

  // Enviar la solicitud a la función serverless
  fetch('/.netlify/functions/solicitud', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ubicacion, destino })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('respuesta').innerText = data.respuesta;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('respuesta').innerText = 'Ocurrió un error al procesar la solicitud.';
  });
}
