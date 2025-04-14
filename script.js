function enviarSolicitud() {
  const nombre = document.getElementById('nombre').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const destino = document.getElementById('destino').value.trim();

  if (!nombre || !ubicacion || !destino) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Construir el mensaje de WhatsApp
  const mensaje = `Hola, soy ${nombre}. Quiero solicitar un servicio de taxi.\n\nUbicación actual: ${ubicacion}\nDestino: ${destino}`;

  // Número de WhatsApp donde quieres recibir los mensajes (con código de país, sin + ni espacios)
  const numeroWhatsApp = '593999034055'; // <-- REEMPLAZA ESTE POR EL TUYO

  // Crear la URL para enviar por WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  // Redirigir a WhatsApp
  window.open(urlWhatsApp, '_blank');

  // Opcional: actualizar el mensaje en pantalla
  document.getElementById('respuesta').innerText = 'Redirigiendo a WhatsApp...';
}
