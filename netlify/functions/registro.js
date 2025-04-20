const { procesarMensaje } = require('./mensajeController');

exports.handler = async (event) => {
  // Aceptar POST y GET temporalmente para pruebas
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  try {
    let data;

    if (event.httpMethod === 'POST') {
      // Si es POST, parseamos el cuerpo del mensaje
      data = JSON.parse(event.body);
    } else {
      // Si es GET, tomamos los parámetros de la URL (query string)
      data = event.queryStringParameters;
    }

    console.log('Datos recibidos:', data); // Agregar esta línea para verificar

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
