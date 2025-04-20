// netlify/functions/message.js
let sesiones = {}; // Memoria temporal por número de teléfono

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  const contentType = event.headers["content-type"] || "";
  let data = {};

  // WhatsAuto usualmente envía como x-www-form-urlencoded
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(event.body);
    for (let [key, value] of params.entries()) {
      data[key] = value;
    }
  } else {
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      console.error("Error al parsear JSON:", error);
    }
  }

  const app = data.app || 'WhatsAuto';
  const sender = data.sender || 'WhatsAuto';
  const phone = data.phone || 'sin número';
  const rawMessage = data.message || '';
  const message = rawMessage.toLowerCase().trim();

  // Inicializamos sesión si no existe
  if (!sesiones[phone]) {
    sesiones[phone] = { estado: 'inicio', cedula: '', ubicacion: '' };
  }

  let estado = sesiones[phone].estado;
  let reply = "";

  // Flujo según el estado del usuario
  if (estado === 'inicio') {
    reply = `Hola, soy el asistente de pedidos de la empresa Route 593. ¿Podrías indicarme tu número de cédula (10 dígitos)?`;
    sesiones[phone].estado = 'esperandoCedula';
  }

  else if (estado === 'esperandoCedula') {
    if (/^\d{10}$/.test(message)) {
      sesiones[phone].cedula = message;
      reply = `¡Gracias! Cédula registrada. Ahora, por favor indícame tu ubicación o urbanización.`;
      sesiones[phone].estado = 'esperandoUbicacion';
    } else {
      reply = `La cédula debe tener exactamente 10 dígitos numéricos. Por favor vuelve a ingresarla.`;
    }
  }

  else if (estado === 'esperandoUbicacion') {
    sesiones[phone].ubicacion = rawMessage; // Guardamos ubicación original
    reply = `Ubicación recibida: ${rawMessage}. ¿Deseas hacer un pedido de taxi ahora? Escribe "pedido" para continuar.`;
    sesiones[phone].estado = 'pedido';
  }

  else if (estado === 'pedido') {
    if (message.includes("pedido") || message.includes("taxi")) {
      reply = `¡Perfecto! En breve un taxi de Route 593 te contactará. Gracias por usar nuestro sistema.`;
      sesiones[phone].estado = 'finalizado';
    } else {
      reply = `Cuando estés listo, escribe "pedido" para solicitar el taxi.`;
    }
  }

  else if (estado === 'finalizado') {
    reply = `Gracias por usar Route 593. Si necesitas otro taxi, solo escribe "pedido".`;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply })
  };
}
