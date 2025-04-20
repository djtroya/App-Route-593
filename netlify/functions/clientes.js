// functions/clientes.js
const { createClient } = require('@supabase/supabase-js');

// Inicializa Supabase con tus credenciales (deberás configurar estas credenciales)
const supabase = createClient('TU_URL_SUPABASE', 'TU_API_KEY_SUPABASE');

exports.handler = async function(event, context) {
  const { cedula, ubicacion, urbanizacion_destino } = JSON.parse(event.body);

  // Verifica si la cédula ya está registrada
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cedula', cedula)
    .single();

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al verificar cliente en la base de datos.' })
    };
  }

  if (data) {
    // El cliente ya existe
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cliente ya registrado.',
        data: data
      })
    };
  }

  // Si no existe, regístralo
  const { error: insertError } = await supabase
    .from('clientes')
    .insert([{ cedula, ubicacion, urbanizacion_destino }]);

  if (insertError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al registrar cliente en la base de datos.' })
    };
  }

  // Respuesta de éxito
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Cliente registrado correctamente.' })
  };
};
