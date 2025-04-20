// netlify/functions/registro.js
const { procesarMensaje } = require('./mensajeController');

exports.handler = async (event) => {
  console.log('Evento recibido:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  try {
    let data;

    if (event.headers['content-type'] === 'application/json' || event.headers['Content-Type'] === 'application/json') {
      data = JSON.parse(event.body);
    } else {
      // Manejo de formulario x-www-form-urlencoded
      const params = new URLSearchParams(event.body);
      data = {};
      for (const [key, value] of params.entries()) {
        data[key] = value;
      }
    }

    console.log('Datos recibidos:', data);

    const respuesta = await procesarMensaje(data);

    return {
      statusCode: 200,
      body: JSON.stringify(respuesta),
    };
  } catch (error) {
    console.error('Error en registro.js:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al procesar el mensaje',
        detalle: error.message,
      }),
    };
  }
};
