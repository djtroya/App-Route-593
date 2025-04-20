const { createClient } = require('@supabase/supabase-js');

// Recuperamos la URL y la API Key de las variables de entorno de Netlify
const supabaseUrl = process.env.SUPABASE_URL; // URL de tu Supabase
const supabaseKey = process.env.SUPABASE_API_KEY; // API Key de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  // Verificamos si es una petición POST
  if (event.httpMethod === 'POST') {
    const { cedula, ubicacion, urbanizacion_destino } = JSON.parse(event.body);

    // Validar si la cédula tiene 10 dígitos
    if (cedula.length === 10) {
      try {
        // Insertar en la base de datos de Supabase
        const { data, error } = await supabase
          .from('clientes')
          .insert([
            { cedula, ubicacion, urbanizacion_destino }
          ]);

        if (error) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Error al registrar el cliente', error }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Cliente registrado exitosamente', data }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error del servidor', error }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'La cédula debe tener 10 dígitos' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }
};
