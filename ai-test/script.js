document.getElementById('taxiForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;
  const hora = document.getElementById('hora').value;
  const pasajeros = document.getElementById('pasajeros').value;
  const comentarios = document.getElementById('comentarios').value;

  let mensaje = `Hola, soy ${nombre}. Me gustaría solicitar un taxi desde ${origen} hasta ${destino}`;

  if (hora) mensaje += ` a las ${hora}`;
  if (pasajeros) mensaje += `. Somos ${pasajeros} pasajero(s)`;
  mensaje += '.';

  if (comentarios) mensaje += ` Nota: ${comentarios}`;

  mensaje += ' ¿Está disponible?';

  document.getElementById('mensajeIA').textContent = mensaje;
  document.getElementById('whatsappBtn').href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  document.getElementById('resultado').classList.remove('oculto');
});
