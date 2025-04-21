const { procesarMensaje } = require('./mensajeController');
const querystring = require('querystring');

// Función para enviar mensajes a WhatsAuto
const enviarMensaje = async (numero, mensaje) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: mensaje,
    }),
  };
};

exports.handler = async (event, context) => {
  let datos;
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  // Verificación del tipo de contenido
  if (contentType && contentType.includes('application/json')) {
    try {
      datos = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: 'El mensaje no tiene el formato esperado (JSON inválido).' }),
      };
    }
  } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
    datos = querystring.parse(event.body);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ reply: 'Tipo de contenido no soportado.' }),
    };
  }

  // Si viene como "sender", lo usamos como número
  if (!datos.numero && datos.sender) {
    datos.numero = datos.sender;
  }
  if (!datos.message && datos.body) {
    datos.message = datos.body;
  }

  // Verificamos si faltan datos
  if (!datos.numero) {
    return await enviarMensaje('', 'Falta el número del remitente.');
  }
  if (!datos.message) {
    return await enviarMensaje(datos.numero, 'Por favor, envía tu mensaje con los datos.');
  }

  try {
    await procesarMensaje({
      numero: datos.numero,
      message: datos.message,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: Hola ${datos.numero}, tus datos han sido registrados exitosamente en Route 593.,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: error.message || 'Hubo un error al procesar tus datos.',
      }),
    };
  }
};
