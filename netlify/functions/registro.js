const { Client } = require('pg');
const { procesarMensaje } = require('./mensajeController'); // Asegúrate que este archivo existe y tiene la lógica correcta

const client = new Client({
  user: process.env.SUPABASE_USER,
  host: process.env.SUPABASE_HOST,
  database: process.env.SUPABASE_DB,
  password: process.env.SUPABASE_PASSWORD,
  port: 5432,
});

exports.handler = async (event) => {
  try {
    // Procesamos el cuerpo de la solicitud como JSON
    const body = JSON.parse(event.body); // Asegúrate de que el cuerpo es un JSON válido
    const phone = body.phone || body.sender; // Tomamos el teléfono o sender como teléfono
    const { message } = body;

    // Si no tenemos teléfono o mensaje, devolvemos un error
    if (!phone || !message) {
      throw new Error('Faltan parámetros: phone o message');
    }

    // Procesamos el mensaje y lo guardamos en la base de datos (con la lógica de mensajeController)
    const resultado = await procesarMensaje(phone, message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: resultado }),
    };
  } catch (error) {
    console.error("Error en registro.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar el mensaje' }),
    };
  }
};
