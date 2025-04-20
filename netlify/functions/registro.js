const { procesarMensaje } = require('./mensajeController');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  let datos;

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  // Detectamos si el contenido es JSON
  if (contentType && contentType.includes('application/json')) {
    try {
      datos = JSON.parse(event.body);
    } catch (error) {
      console.error('Error al parsear JSON:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Cuerpo inválido, se esperaba JSON.' }),
      };
    }
  }
  // Detectamos si el contenido es x-www-form-urlencoded (como envía WhatsAuto)
  else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
    datos = querystring.parse(event.body);
  }
  // No se reconoce el tipo de contenido
  else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Tipo de contenido no soportado.' }),
    };
  }

  console.log('Datos recibidos:', datos);

  try {
    await procesarMensaje(datos);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Datos procesados correctamente.' }),
    };
  } catch (error) {
    console.error('Error procesando:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando los datos.' }),
    };
  }
};
