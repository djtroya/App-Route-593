const { procesarMensaje } = require('./mensajeController');
const querystring = require('querystring');

// Función para enviar mensajes a WhatsAuto
const enviarMensaje = async (phone, mensaje) => {
  // Aquí iría la lógica para enviar el mensaje de WhatsAuto
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

  // Si viene como "sender", lo usamos como "phone"
  if (!datos.phone && datos.sender) {
    datos.phone = datos.sender;
  }

  // Verificamos los datos y solicitamos lo que falta
  if (!datos.cedula) {
    // Si falta la cédula, preguntar
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu cédula de identidad.");
  }

  if (!datos.location) {
    // Si falta ubicación, preguntar
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu ubicación.");
  }

  if (!datos.urbanization) {
    // Si falta urbanización, preguntar
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu urbanización.");
  }

  if (!datos.destination) {
    // Si falta destino, preguntar
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu destino.");
  }

  // Si todos los datos están presentes, procesamos y guardamos
  try {
    await procesarMensaje(datos);  // Guardamos en Supabase
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: 'Hola ' + $(datos.sender || datos.phone) + ', tus datos han sido registrados exitosamente en Route 593.',
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: 'Faltan datos o el formato es incorrecto. Por favor envía: Cédula, Ubicación, Urbanización y Destino.',
      }),
    };
  }
};
