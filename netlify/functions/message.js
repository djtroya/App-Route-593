const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
      data[key] = value;
    });
  }

  const app = data.app || "WhatsAuto";
  const sender = data.sender || "Cliente";
  const message = (data.message || "").trim();
  const phone = data.phone || "";
  const group = data.group_name || "";

  console.log("Mensaje recibido:", message);

  // Llamada a OpenAI
  let aiReply = "Gracias por tu mensaje.";

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un asistente amable y profesional del sistema de pedidos de taxi Route 593. Siempre hablas en español con buena ortografía y ayudas al cliente a pedir un taxi, compartir su ubicación, cédula o destino.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    aiReply = completion.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error con OpenAI:", error);
    aiReply = "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.";
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reply: aiReply,
      app,
      sender,
      phone,
    }),
  };
};
