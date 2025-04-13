const { ChatGPTAPI } = require('chatgpt');

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

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
      temperature: 0.2 // Baja temperatura para respuestas más precisas
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: response.text })
    };

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error al procesar la solicitud.' })
    };
  }
};
