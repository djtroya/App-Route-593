export async function handler(event, context) {
  console.log("Método recibido:", event.httpMethod);
  
  // Verifica que sea POST
  if (event.httpMethod !== "POST") {
    console.log("Método no permitido");
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  try {
    // Intenta parsear el cuerpo
    const data = JSON.parse(event.body || '{}');
    console.log("Datos parseados:", data);

    const sender = data.sender || 'Usuario';
    const message = (data.message || '').toLowerCase().trim();

    let reply = "No entendí tu mensaje.";
    console.log("Mensaje recibido:", message);

    // Lógica de respuestas
    if (message === "hola") {
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
      body: JSON.stringify({ reply }) // Esta es la respuesta final que WhatsAuto espera
    };
  } catch (error) {
    console.error("Error procesando la solicitud:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Error interno en el servidor",
        error: error.message || "Error desconocido"
      })
    };
  }
}
