// Supongamos que usamos un estado para manejar la transición de pasos
let estado = 'esperandoCedula'; // Estado inicial esperando la cédula

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  const data = JSON.parse(event.body || '{}');
  const app = data.app || 'WhatsAuto';
  const sender = data.sender || 'WhatsAuto app';
  const message = (data.message || '').toLowerCase().trim();
  const phone = data.phone || '';
  let reply = "No entendí tu mensaje.";

  // Aquí manejamos el flujo de las interacciones con el usuario
  if (estado === 'esperandoCedula') {
    // Verificar si el mensaje contiene exactamente 10 dígitos
    if (message.match(/^\d{10}$/)) {
      reply = `¡Cédula registrada correctamente! ¿Ahora, podrías indicarme tu ubicación o el destino?`;
      estado = 'esperandoUbicacion';  // Cambiamos al siguiente estado
    } else {
      reply = `Por favor, ingresa tu cédula de 10 dígitos.`;
    }
  } else if (estado === 'esperandoUbicacion') {
    // Si la ubicación o destino es enviado
    if (message) {
      reply = `Ubicación/destino recibido: ${message}. ¿En qué más puedo ayudarte?`;
      estado = 'esperandoPedido';  // Cambiamos al siguiente estado
    } else {
      reply = `Por favor, ingresa tu ubicación o destino.`;
    }
  } else if (estado === 'esperandoPedido') {
    // Aquí puedes gestionar la respuesta para cuando se hace un pedido
    if (message === 'pedido') {
      reply = `Para hacer un pedido, por favor envía tu ubicación.`;
    } else {
      reply = `Entendido, ¿en qué más te puedo ayudar?`;
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply, estado }) // Retornamos el estado actual
  };
}
