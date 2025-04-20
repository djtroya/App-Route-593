let memoriaUsuarios = {}; // Simulación de memoria en tiempo real

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ reply: "Método no permitido" })
    };
  }

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    let data = {};

    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body);
      data = Object.fromEntries(params.entries());
    }

    const sender = data.sender || 'Usuario';
    const phone = data.phone || 'desconocido';
    const message = (data.message || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    let reply = '';
    const yaRegistrado = memoriaUsuarios[phone]?.cedula;
    const contieneCedula = /\b\d{10}\b/.test(message);
    const contieneUbicacion = /(mi ubicacion|estoy aqui|direccion es|urbanizacion|voy a|destino)/.test(message);
    const coordenadas = message.match(/-?\d{1,3}\.\d{3,},\s*-?\d{1,3}\.\d{3,}/);

    if (!yaRegistrado && contieneCedula) {
      const cedula = message.match(/\b\d{10}\b/)[0];
      memoriaUsuarios[phone] = { cedula };
      reply = `Gracias ${sender}, hemos registrado tu cédula. ¿Podrías indicarnos tu urbanización o destino?`;
    } else if (!yaRegistrado) {
      reply = `Hola ${sender}, soy el asistente de *Route 593*. Antes de continuar, por favor envía tu número de cédula (10 dígitos).`;
    } else if (contieneUbicacion || coordenadas) {
      reply = `¡Perfecto ${sender}! Hemos recibido tu destino. Un conductor se pondrá en contacto contigo.`;
    } else if (message.includes("hola") || message.includes("buenas")) {
      reply = `Hola ${sender}, ¿en qué podemos ayudarte hoy? Puedes escribir "pedido" o compartir tu ubicación.`;
    } else if (message.includes("pedido") || message.includes("taxi") || message.includes("llevar")) {
      reply = `Genial ${sender}, por favor indícanos tu ubicación o urbanización para enviarte un taxi.`;
    } else if (message.includes("gracias")) {
      reply = `¡Con gusto, ${sender}! Estamos para servirte en Route 593.`;
    } else {
      reply = `No entendí tu mensaje, ${sender}. Puedes escribir "pedido", enviar tu ubicación o tu cédula si es la primera vez.`;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        reply,
        received: data,
        registrado: memoriaUsuarios[phone] || null
      })
    };
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ reply: "Error interno del servidor", error: error.message })
    };
  }
}
