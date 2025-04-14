function enviarSolicitud() {
  const nombre = document.getElementById('nombre').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const destino = document.getElementById('destino').value;

  if (!nombre || !ubicacion || !destino) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const numeroWhatsApp = '593987654321'; // Reemplaza con tu número real
  const mensaje = `Hola, soy ${nombre}. Estoy en ${ubicacion} y quiero ir a ${destino}. Por favor, envíen un taxi. Gracias.`;

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
