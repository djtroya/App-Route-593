export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const sender = data.sender || 'Usuario';
    const message = (data.message || '').toLowerCase().trim();

    let reply = "No entendí tu mensaje.";

    if (message === "hola") {
      reply = `Hola ${sender}, ¿en qué puedo ayudarte?`;
    } else if (message === "pedido") {
      reply = "Para hacer un pedido, por favor envía tu ubicación.";
    } else if (message.includes("gracias")) {
      reply = `¡De nada, ${sender}!`;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }) // <- RESPUESTA QUE ESPERA WhatsAuto
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Error interno en el servidor"
      })
    };
  }
}
