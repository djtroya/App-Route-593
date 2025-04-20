const { procesarMensaje } = require('./mensajeController');

exports.handler = async (event, context) => {
  const { body } = event; // Se obtiene el cuerpo de la solicitud

  // Si el cuerpo está vacío, retorna un error
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No se recibieron datos.' }),
    };
  }

  const datos = JSON.parse(body); // Convierte el cuerpo a un objeto JSON
  console.log('Datos recibidos:', datos);

  try {
    // Procesamos el mensaje
    await procesarMensaje(datos);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Datos procesados correctamente.' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando los datos.' }),
    };
  }
};
