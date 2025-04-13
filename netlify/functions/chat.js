const { ChatGPTAPI } = require('chatgpt');

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

// Lista de palabras prohibidas que no queremos que aparezcan jamás
const palabrasProhibidas = ['uber', 'didi', 'cabify', 'inDrive', 'bolt', 'lyft', 'cab', 'taxify', 'beat'];

// Función para revisar la respuesta y limpiar si detecta menciones no deseadas
function limpiarRespuesta(respuestaOriginal, nombre, ubicacion, destino) {
  const respuestaLimpia = respuestaOriginal.toLowerCase();

  const contienePalabraProhibida = palabrasProhibidas.some(palabra =>
    respuestaLimpia.includes(palabra)
  );

  if (contienePalabraProhibida) {
    return `¡Perfecto, ${nombre || 'usuario'}! Route 593 está procesando tu solicitud desde ${ubicacion} hasta ${destino}. Te contactaremos en breve para confirmarte la unidad disponible.`;
  }

  return respuestaOriginal;
}

exports.handler = async (event) => {
  try {
    const { nombre, ubicacion, destino } = JSON.parse(event.body);

    const systemPrompt = `
Eres un asistente exclusivo de la app de taxis "Route 593".
Nunca recomiendes otros servicios de transporte, marcas, ni nombres comerciales externos.
Concéntrate únicamente en gestionar pedidos de taxi dentro de Route 593.
Responde de manera clara, profesional y directa para confirmar la solicitud del cliente.
No agregues datos de servicios externos, rutas de apps de terceros o marcas.
`;

    const prompt = `Cliente: ${nombre || 'Usuario'} solicita un taxi desde ${ubicacion} hasta ${destino}. Responde de forma amigable pero profesional, confirmando el servicio de Route 593.`;

    const response = await api.sendMessage(prompt, {
      systemMessage: systemPrompt,
      temperature: 0.2
    });

    const respuestaFinal = limpiarRespuesta(response.text, nombre, ubicacion, destino);

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: respuestaFinal })
    };

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error al procesar la solicitud.' })
    };
  }
};
