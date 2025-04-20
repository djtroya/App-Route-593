// netlify/functions/registro.js
const { procesarMensaje } = require('./controllers/mensajeController');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  try {
    const data = JSON.parse(event.body);
    const respuesta = await procesarMensaje(data);

    return {
      statusCode: 200,
      body: JSON.stringify(respuesta),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar el mensaje', detalle: error.message }),
    };
  }
};
