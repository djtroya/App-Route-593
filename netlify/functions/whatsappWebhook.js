const { createClient } = require('@supabase/supabase-js');

// Variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      console.log("Raw body:", event.body);

      const body = JSON.parse(event.body);
      const { app, sender, message, phone, cedula, ubicacion, destino, urbanizacion } = body;

      console.log("Datos recibidos:", { app, sender, message, phone, cedula, ubicacion, destino, urbanizacion });

      // Inserción mínima por ahora para probar
      const { data, error } = await supabase
        .from('clientes')
        .insert([
          {
            app,
            sender,
            phone,
            message,
            cedula: cedula || null,
            ubicacion: ubicacion || null,
            destino: destino || null,
            urbanizacion: urbanizacion || null,
            fecha_creacion: new Date(),
          },
        ]);

      if (error) {
        console.error("Error al guardar en Supabase:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error al guardar en Supabase' }),
        };
      }

      console.log("Datos guardados en Supabase:", data);

      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "¡Gracias por tu mensaje! Lo hemos recibido." }),
      };
    } catch (error) {
      console.error("Error general:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al procesar la solicitud' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Método no permitido' }),
  };
};
