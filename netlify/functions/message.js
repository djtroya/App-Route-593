export async function handler(event, context) {
  console.log("Método recibido:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
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

    let reply = "No entendí tu mensaje. ¿Puedes escribirlo de otra forma?";

    const saludos = ["hola", "buenas", "saludos", "hey", "holi"];
    const pedidos = ["pedido", "taxi", "llevar", "auto", "quiero ir", "necesito un taxi"];
    const agradecimientos = ["gracias", "muy amable", "te agradezco", "graciass"];

    if (saludos.some(p => message.includes(p))) {
      reply = `Hola ${sender}, soy el asistente del sistema *Route 593*. ¿Necesitas un taxi?`;
    } else if (pedidos.some(p => message.includes(p))) {
      reply = "Perfecto. Para hacer un pedido, por favor envía tu ubicación o escribe a dónde quieres ir.";
    } else if (agradecimientos.some(p => message.includes(p))) {
      reply = `¡De nada, ${sender}! Cualquier cosa, aquí estoy.`;
    }

    console.log("Respuesta generada:", reply);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        reply,
        received: data
      })
    };
  } catch (error) {
    console.error("Error procesando la solicitud:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        reply: "Error interno en el servidor",
        error: error.message || "Error desconocido"
      })
    };
  }
}
