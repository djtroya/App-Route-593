function enviarSolicitud() {
  const ubicacion = document.getElementById('ubicacion').value;
  const destino = document.getElementById('destino').value;

  if (!ubicacion || !destino) {
    alert('Por favor, completa ambos campos.');
    return;
  }

  // Mostrar mensaje de prueba
  document.getElementById('respuesta').innerText = `Solicitud enviada: desde "${ubicacion}" hasta "${destino}".`;

  // Aquí luego conectaremos la API
}
