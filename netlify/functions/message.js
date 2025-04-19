export async function handler(event, context) {
  console.log("Método:", event.httpMethod);
  console.log("Body crudo:", event.body);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  try {
    const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    console.log("Body parseado:", data);

    const app = data.app || 'WhatsAuto';
    const sender = data.sender || 'Usuario';
    const message = (data.message || '').toLowerCase().trim();
    const group = data.group_name || '';
    const phone = data.phone || '';

    let reply = "No entendí tu mensaje.";

    if (!message) {
      reply = "Mensaje vacío. Por favor, escribe algo.";
    } else if (message === "hola") {
      reply = `Hola ${sender}, ¿en qué puedo ayudarte?`;
    } else if (message === "pedido") {
      reply = "Para hacer un pedido, por favor envía tu ubicación.";
    } else if (message.includes("gracias")) {
      reply = `¡De nada, ${sender}!`;
    }

    console.log("Respuesta generada:", reply);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Error capturado:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: "Error al procesar el mensaje.",
        error: error.message || String(error) || "Error desconocido"
      })
    };
  }
}
