// netlify/functions/message.js

export async function handler(event, context) {
  console.info("Método recibido:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" }),
    };
  }

  let data = {};
  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";

  try {
    if (contentType.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      data = Object.fromEntries(new URLSearchParams(event.body));
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Formato no soportado" }),
      };
    }

    const app = data.app || "WhatsAuto";
    const sender = data.sender || "Usuario";
    const message = (data.message || "").toLowerCase().trim();
    const phone = data.phone || "sin número";
    const group = data.group_name || "";
    const coordenadas = data.location || "";

    console.info("Content-Type:", contentType);
    console.info("Datos parseados:", data);

    // Simulación de memoria temporal por número
    global.memoriaUsuarios = global.memoriaUsuarios || {};

    let reply = "No entendí tu mensaje. Soy el asistente de *Route 593*, ¿en qué puedo ayudarte?";
    const yaRegistrado = memoriaUsuarios[phone]?.cedula;
    const contieneCedula = /\b\d{10}\b/.test(message);
    const contieneUbicacion = /(urbanización|destino|barrio|sector)/i.test(message) || coordenadas;

    if (!yaRegistrado && contieneCedula) {
      const cedula = message.match(/\b\d{10}\b/)[0];
      memoriaUsuarios[phone] = { cedula };
      if (contieneUbicacion || coordenadas) {
        reply = `Gracias ${sender}, hemos registrado tu cédula. También recibimos tu destino. Un conductor se comunicará contigo.`;
      } else {
        reply = `Gracias ${sender}, hemos registrado tu cédula. ¿Podrías indicarnos tu urbanización o destino?`;
      }
    } else if (!yaRegistrado) {
      reply = `Hola ${sender}, soy el asistente de *Route 593*. Antes de continuar, por favor envía tu número de cédula (10 dígitos).`;
    } else if (contieneUbicacion || coordenadas) {
      reply = `¡Perfecto ${sender}! Hemos recibido tu destino. Un conductor se pondrá en contacto contigo.`;
    } else if (message.includes("hola") || message.includes("buenas")) {
      reply = `Hola ${sender}, soy el asistente de *Route 593*. ¿Deseas pedir un taxi?`;
    } else if (message.includes("gracias")) {
      reply = `¡De nada, ${sender}! Estamos para ayudarte.`;
    }

    console.info("Respuesta generada:", reply);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Ocurrió un error en el sistema Route 593." }),
    };
  }
}
