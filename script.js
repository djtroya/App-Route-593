async function enviarSolicitud() {
  const ubicacion = document.getElementById('ubicacion').value;
  const destino = document.getElementById('destino').value;

  const respuesta = document.getElementById('respuesta');
  respuesta.textContent = "Procesando tu solicitud...";

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ubicacion, destino })
    });

    const data = await res.json();
    respuesta.textContent = data.respuesta;
  } catch (error) {
    respuesta.textContent = "Error al procesar la solicitud.";
  }
}
