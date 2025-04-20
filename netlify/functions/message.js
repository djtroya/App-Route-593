export async function handler(event, context) {
  console.log("Método recibido:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  // Detectar tipo de contenido y parsear correctamente
  let data = {};
  const contentType = event.headers["content-type"] || "";

  if (contentType.includes("application/json")) {
    data = JSON.parse(event.body || '{}');
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const querystring = require("querystring");
    data = querystring.parse(event.body);
  }

  const app = data.app || 'WhatsAuto';
  const sender = data.sender || 'cliente';
  const message = (data.message || '').toLowerCase().trim();
  const phone = data.phone || '';
  
  // Variables en memoria
  let isNewUser = false;
  let cedula = data.cedula || '';

  // Inicializar respuesta
  let reply = `Hola ${sender}, soy el asistente de Route 593.`;

  // Verificar si envió cédula (solo números de 10 dígitos)
  const cedulaRegex = /^\d{10}$/;
  if (cedulaRegex.test(message)) {
    cedula = message;
    isNewUser = true;
    reply = `Gracias. Cédula registrada: ${cedula}. ¿Puedes enviarme tu ubicación o urbanización?`;
  } 
  else if (message.includes("pedido") || message.includes("taxi")) {
    reply = `Por favor, envía tu ubicación o destino.`;
  } 
  else if (message.includes("hola")) {
    reply = `Hola ${sender}, ¿necesitas un taxi?`;
  }
  else if (message.includes("gracias")) {
    reply = `¡Con gusto!`;
  } 
  else if (!cedula && message.match(/\d+/)) {
    reply = `Parece que intentas enviar tu cédula. Asegúrate de que tenga exactamente 10 dígitos.`;
  } 
  else {
    reply = `Indica "pedido" para solicitar un taxi o envía tu cédula.`;
  }

  console.log("Respuesta generada:", reply);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ reply })
  };
}
