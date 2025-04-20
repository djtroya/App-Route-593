import { OpenAI } from 'openai';  // Asegúrate de importar correctamente la nueva librería

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',  // Esto es importante para el nuevo endpoint
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" }),
    };
  }

  const contentType = event.headers["content-type"] || event.headers["Content-Type"];
  let data = {};

  if (contentType.includes("application/json")) {
    data = JSON.parse(event.body || "{}");
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(event.body);
    params.forEach((value, key) => {
      data[key] = decodeURIComponent(value);  // Decodificar para manejar tildes y caracteres especiales
    });
  }

  const app = data.app || "WhatsAuto";
  const sender = data.sender || "Cliente";
  const message = (data.message || "").trim();
  const phone = data.phone || "";

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ reply: "No se recibió ningún mensaje" }),
    };
  }

  let aiReply = "Gracias por tu mensaje.";

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // O el modelo que estés usando
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente amable y profesional del sistema de pedidos de taxi Route 593.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    aiReply = completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error con OpenAI:", error);
    aiReply = "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.";
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reply: encodeURIComponent(aiReply),  // Codificar la respuesta para mantener caracteres especiales
      app,
      sender,
      phone,
    }),
  };
};
