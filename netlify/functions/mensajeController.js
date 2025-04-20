const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

// Validación de variables de entorno
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_API_KEY');
}

const client = createClient(supabaseUrl, supabaseKey);

async function procesarMensaje({ phone, message, location, urbanization, destination }) {
  if (!phone || !message) {
    throw new Error('Faltan parámetros básicos: phone o message');
  }

  const { data, error } = await client
    .from('registros')
    .insert([{ phone, message, location, urbanization, destination }]);

  if (error) {
    console.error('Error al guardar los datos:', error);
    throw new Error('No se pudo guardar en la base de datos');
  }

  console.log('Datos guardados:', data);
}

module.exports = { procesarMensaje };
