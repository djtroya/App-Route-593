const { createClient } = require('@supabase/supabase-js');
const querystring = require('querystring');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const estadoConversacion = {}; // Memoria temporal por número

function responder(texto) {
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: texto }),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const rawBody = event.body;
    const params = querystring.parse(rawBody);

    const { app, sender, phone, message } = params;
    const numero = phone || sender;

    console.log('Datos recibidos:', { app, sender, message, phone });

    if (!estadoConversacion[numero]) {
      estadoConversacion[numero] = {
        paso: 1,
        datos: {
          phone, // Aquí usamos "phone" directamente
          app,
          sender
        }
      };
    }

    const estado = estadoConversacion[numero];

    switch (estado.paso) {
      case 1:
        if (!/^\d{10}$/.test(message.trim())) {
          return responder('Bienvenido a Route 593. Por favor, ingresa una cédula válida de 10 dígitos.');
        }
        estado.datos.cedula = message.trim();
        estado.paso++;
        return responder('Gracias. ¿Cuál es tu ubicación?');

      case 2:
        estado.datos.ubicacion = message.trim();
        estado.paso++;
        return responder('Perfecto. ¿En qué urbanización estás?');

      case 3:
        estado.datos.urbanizacion = message.trim();
        estado.paso++;
        return responder('Y por último, ¿cuál es tu destino?');

      case 4:
        estado.datos.destino = message.trim();
        estado.paso++;

        const { data, error } = await supabase
          .from('clientes')
          .insert([estado.datos]);

        if (error) {
          console.error('Error al guardar en Supabase:', error);
          return responder('Hubo un problema al guardar tus datos.');
        }

        console.log('Datos guardados en Supabase:', data);

        delete estadoConversacion[numero];
        return responder('¡Tu viaje ha sido registrado con éxito! Pronto te contactaremos.');

      default:
        return responder('Ya hemos recibido tus datos. ¡Gracias!');
    }

  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
