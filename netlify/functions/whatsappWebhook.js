const { createClient } = require('@supabase/supabase-js');

// Variables de entorno para conectarse a Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      // Parseamos el cuerpo de la solicitud
      const body = JSON.parse(event.body);
      const { app, sender, message, phone, cedula, ubicacion, destino, urbanizacion } = body;

      // Verificamos si los datos de sender y phone contienen la información real del cliente
      const senderInfo = sender !== 'WhatsAuto' ? sender : 'Desconocido';
      const phoneInfo = phone !== 'WhatsAuto' ? phone : 'Desconocido';

      // Validamos que los datos necesarios estén presentes
      if (!cedula || !ubicacion || !destino || !urbanizacion) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Faltan campos requeridos' }),
        };
      }

      // Insertamos los datos en Supabase
      const { data, error } = await supabase
        .from('clientes') // Nombre de la tabla en Supabase
        .insert([
          {
            sender: senderInfo,
            message: message,
            app: app,
            phone: phoneInfo,
            cedula: cedula,
            ubicacion: ubicacion,
            destino: destino,
            urbanizacion: urbanizacion,
            fecha_creacion: new Date(), // Fecha y hora de creación
          },
        ]);

      // Manejo de errores si no se pudo guardar
      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al guardar en Supabase' }),
        };
      }

      // Respuesta con un mensaje de éxito
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "¡Gracias por tu mensaje! Lo hemos recibido." }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al procesar la solicitud' }),
      };
    }
  }

  // Si no es un POST, respondemos con un error
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Método no permitido' }),
  };
};
