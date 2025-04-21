const querystring = require('querystring');
const { guardarDato, obtenerCliente } = require('./mensajeController');

const enviarMensaje = async (numero, mensaje) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: mensaje }),
  };
};

exports.handler = async (event) => {
  let datos;
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if (contentType.includes('application/json')) {
    datos = JSON.parse(event.body);
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    datos = querystring.parse(event.body);
  } else {
    return { statusCode: 400, body: JSON.stringify({ reply: 'Tipo de contenido no soportado.' }) };
  }

  const numero = datos.sender || datos.numero;
  const mensaje = datos.message?.trim();

  if (!numero || !mensaje) {
    return await enviarMensaje(numero, 'Faltan datos básicos para procesar el mensaje.');
  }

  const cliente = await obtenerCliente(numero);

  if (!cliente?.cedula && /^\d{10}$/.test(mensaje)) {
    await guardarDato(numero, 'cedula', mensaje);
    return await enviarMensaje(numero, 'Gracias. Ahora, por favor ingresa tu ubicación.');
  }

  if (!cliente?.ubicacion && mensaje.toLowerCase().includes('ubicación:')) {
    const ubicacion = mensaje.split(':')[1]?.trim();
    if (ubicacion) {
      await guardarDato(numero, 'ubicacion', ubicacion);
      return await enviarMensaje(numero, 'Perfecto. ¿Cuál es tu urbanización?');
    }
  }

  if (!cliente?.urbanizacion && mensaje.toLowerCase().includes('urbanización:')) {
    const urbanizacion = mensaje.split(':')[1]?.trim();
    if (urbanizacion) {
      await guardarDato(numero, 'urbanizacion', urbanizacion);
      return await enviarMensaje(numero, 'Gracias. Finalmente, ¿a qué destino te diriges?');
    }
  }

  if (!cliente?.destino && mensaje.toLowerCase().includes('destino:')) {
    const destino = mensaje.split(':')[1]?.trim();
    if (destino) {
      await guardarDato(numero, 'destino', destino);
      return await enviarMensaje(numero, '¡Datos completos! Te registramos exitosamente en Route 593.');
    }
  }

  // Verificamos si ya tiene todos los datos
  const actualizado = await obtenerCliente(numero);
  if (
    actualizado?.cedula &&
    actualizado?.ubicacion &&
    actualizado?.urbanizacion &&
    actualizado?.destino
  ) {
    return await enviarMensaje(numero, 'Ya estás registrado. Gracias por usar Route 593.');
  }

  // Si no entendemos el mensaje
  return await enviarMensaje(
    numero,
    'No entendí tu mensaje. Por favor, responde con: tu cédula (10 dígitos), "Ubicación: _", "Urbanización: _", o "Destino: _" según lo que falte.'
  );
};
