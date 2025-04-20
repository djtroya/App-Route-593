const { procesarMensaje } = require('./mensajeController');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  let datos;

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

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
  } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
    datos = querystring.parse(event.body);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Tipo de contenido no soportado.' }),
    };
  }

  // Mapear 'sender' como 'phone' si no existe directamente
  if (!datos.phone && datos.sender) {
    datos.phone = datos.sender;
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
