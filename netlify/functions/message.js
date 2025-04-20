export async function handler(event, context) {
  console.log("Método recibido:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    console.log("Método no permitido");
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  try {
    let data = {};

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    console.log("Content-Type:", contentType);

    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body);
      data = Object.fromEntries(params.entries());
    }

    console.log("Datos parseados:", data);

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

    console.log("Respuesta generada:", reply);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
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
