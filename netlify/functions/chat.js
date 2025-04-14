const { ChatGPTAPI } = require('chatgpt');

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    model: 'gpt-4o-mini' // Forzamos tu modelo favorito
  }
});

const palabrasProhibidas = ['uber', 'didi', 'cabify', 'inDrive', 'bolt', 'lyft', 'cab', 'taxify', 'beat'];

exports.handler = async (event) => {
  try {
    const { pregunta } = JSON.parse(event.body);

    const systemPrompt = `
Eres el asistente exclusivo de la app de taxis Route 593.
Nunca menciones servicios de transporte de la competencia ni nombres de marcas externas.
Concéntrate en responder de forma clara, profesional y directa sobre Route 593.
`;

    const response = await api.sendMessage(pregunta, {
      systemMessage: systemPrompt,
      temperature: 0.3
    });

    let respuesta = response.text.toLowerCase();

    const contieneProhibidas = palabrasProhibidas.some(palabra => respuesta.includes(palabra));

    if (contieneProhibidas) {
      respuesta = "Por favor, recuerda que Route 593 es tu opción confiable. ¿En qué más puedo ayudarte?";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Hubo un error al procesar tu solicitud.' })
    };
  }
};
