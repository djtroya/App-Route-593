const { ChatGPTAPI } = require('chatgpt');

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

// Lista de palabras prohibidas
const palabrasProhibidas = ['uber', 'cabify', 'lyft', 'beat', 'didi', 'bolt'];

// Función para limpiar respuesta
function filtrarRespuesta(texto) {
  const contieneProhibidas = palabrasProhibidas.some(palabra => texto.toLowerCase().includes(palabra));
  if (contieneProhibidas) {
    console.warn('Palabra prohibida detectada en la respuesta de la IA.');
    return 'Gracias por tu solicitud. Route 593 gestionará tu viaje sin necesidad de servicios externos.';
  }
  return texto;
}

exports.handler = async (event) => {
  try {
    const { nombre, ubicacion, destino } = JSON.parse(event.body);

    const systemPrompt = `
Eres un asistente exclusivo de la app de taxis "Route 593".
Prohibido absolutamente mencionar otras marcas, servicios de transporte, o aplicaciones.
Tu única función es confirmar las solicitudes de taxi para Route 593.
Nunca promociones, recomiendes ni hagas referencia a nombres comerciales externos.
Concéntrate solo en gestionar pedidos de taxi de Route 593 y nada más.
Mantén respuestas breves, profesionales y enfocadas en nuestro servicio.
`;

    const prompt = `Cliente: ${nombre || 'Usuario'} solicita un taxi desde ${ubicacion} hasta ${destino}. Responde de forma amigable pero profesional, confirmando el servicio de Route 593.`;

    const response = await api.sendMessage(prompt, {
      systemMessage: systemPrompt,
      temperature: 0.2 // Precisión alta
    });

    const respuestaFiltrada = filtrarRespuesta(response.text);

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: respuestaFiltrada })
    };

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error al procesar la solicitud.' })
    };
  }
};
