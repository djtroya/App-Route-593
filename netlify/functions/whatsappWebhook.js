const { createClient } = require('@supabase/supabase-js');
const querystring = require('querystring');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

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
    const msg = message.trim();

    // Buscar estado anterior en Supabase
    let { data: estado, error } = await supabase
      .from('conversaciones')
      .select('*')
      .eq('numero', numero)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error al obtener estado:', error);
      return responder('Error al recuperar tu estado anterior.');
    }

    if (!estado) {
      // Iniciar nueva conversación
      estado = {
        numero,
        paso: 1,
        datos: { numero, app, sender },
      };
      await supabase.from('conversaciones').insert([estado]);
    }

    // Flujo según paso
    switch (estado.paso) {
      case 1: {
        const cedula = msg.match(/\d{10}/);
        if (!cedula) {
          return responder('Bienvenido a Route 593. Por favor, ingresa una cédula válida de 10 dígitos.');
        }
        estado.datos.cedula = cedula[0];
        estado.paso = 2;
        break;
      }

      case 2:
        estado.datos.ubicacion = msg;
        estado.paso = 3;
        break;

      case 3:
        estado.datos.urbanizacion = msg;
        estado.paso = 4;
        break;

      case 4:
        estado.datos.destino = msg;
        estado.paso = 5;

        // Confirmación de datos
        await supabase
          .from('conversaciones')
          .update({ paso: 5, datos: estado.datos })
          .eq('numero', numero);

        return responder(`Resumen:\nCédula: ${estado.datos.cedula}\nUbicación: ${estado.datos.ubicacion}\nUrbanización: ${estado.datos.urbanizacion}\nDestino: ${estado.datos.destino}\n\n¿Confirmas el viaje? Responde "sí" o "no".`);
        
      case 5:
        if (msg.toLowerCase() === 'sí') {
          const { error: insertError } = await supabase
            .from('clientes')
            .insert([estado.datos]);

          if (insertError) {
            console.error('Error al guardar en clientes:', insertError);
            return responder('Hubo un problema al guardar tus datos.');
          }

          await supabase.from('conversaciones').delete().eq('numero', numero);
          return responder('¡Tu viaje ha sido registrado con éxito! Pronto te contactaremos.');
        } else {
          await supabase.from('conversaciones').delete().eq('numero', numero);
          return responder('Registro cancelado. Si deseas intentarlo de nuevo, escribe "hola".');
        }

      default:
        await supabase.from('conversaciones').delete().eq('numero', numero);
        return responder('Ya hemos procesado tu solicitud. Gracias por usar Route 593.');
    }

    // Guardar estado actualizado
    await supabase
      .from('conversaciones')
      .update({ paso: estado.paso, datos: estado.datos })
      .eq('numero', numero);

    // Respuesta según paso
    const respuestas = {
      2: 'Gracias. ¿Cuál es tu ubicación?',
      3: 'Perfecto. ¿En qué urbanización estás?',
      4: 'Y por último, ¿cuál es tu destino?',
    };

    return responder(respuestas[estado.paso]);

  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
