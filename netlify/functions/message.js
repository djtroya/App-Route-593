export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  const data = JSON.parse(event.body || '{}');
  const app = data.app || 'WhatsAuto';
  const sender = data.sender || 'WhatsAuto';
  const message = (data.message || '').toLowerCase().trim();
  const group = data.group_name || '';
  const phone = data.phone || '';

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
    body: JSON.stringify({ reply })
  };
}
