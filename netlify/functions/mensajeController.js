const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_API_KEY');
}

const client = createClient(supabaseUrl, supabaseKey);

async function procesarMensaje({ phone, message, cedula, location, urbanization, destination }) {
  if (!phone || !message) {
    throw new Error('Faltan parámetros básicos: phone o message');
  }

  const { data, error } = await client
    .from('clientes')
    .insert([{
      numero: phone,
      mensaje: message,
      cedula: cedula || null,
      ubicacion: location || null,
      urbanizacion: urbanization || null,
      destino: destination || null
    }]);

  if (error) {
    console.error('Error al guardar los datos:', JSON.stringify(error,null,2));
    throw new Error('No se pudo guardar en la base de datos');
  }

  console.log('Datos guardados:', data);
}

module.exports = { procesarMensaje };
