const { procesarMensaje } = require('./mensajeController');
const querystring = require('querystring');

// Función para enviar mensajes a WhatsAuto
const enviarMensaje = async (phone, mensaje) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: mensaje,
    }),
  };
};

// Función para extraer campos desde el texto del mensaje
const extraerCamposDesdeMensaje = (texto) => {
  const cedula = texto.match(/C[eé]dula:\s*(\d{10})/i)?.[1];
  const location = texto.match(/Ubicaci[oó]n:\s*(.+?)(?:Urbanizaci[oó]n:|Destino:|$)/i)?.[1]?.trim();
  const urbanization = texto.match(/Urbanizaci[oó]n:\s*(.+?)(?:Destino:|$)/i)?.[1]?.trim();
  const destination = texto.match(/Destino:\s*(.+)/i)?.[1]?.trim();
  return { cedula, location, urbanization, destination };
};

exports.handler = async (event, context) => {
  let datos;
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

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

  if (!datos.phone && datos.sender) {
    datos.phone = datos.sender;
  }

  // Extraer campos desde el mensaje si vienen todos pegados
  if (datos.message) {
    const extraidos = extraerCamposDesdeMensaje(datos.message);
    datos.cedula = datos.cedula || extraidos.cedula;
    datos.location = datos.location || extraidos.location;
    datos.urbanization = datos.urbanization || extraidos.urbanization;
    datos.destination = datos.destination || extraidos.destination;
  }

  // Verificamos los datos y pedimos lo que falta
  if (!datos.cedula) {
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu cédula de identidad.");
  }

  if (!datos.location) {
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu ubicación.");
  }

  if (!datos.urbanization) {
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu urbanización.");
  }

  if (!datos.destination) {
    return await enviarMensaje(datos.phone, "Por favor, ingresa tu destino.");
  }

  try {
    await procesarMensaje(datos);
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: Hola ${datos.sender || datos.phone}, tus datos han sido registrados exitosamente en Route 593.,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: 'Ocurrió un error al guardar tus datos. Por favor, intenta nuevamente más tarde.',
      }),
    };
  }
};
