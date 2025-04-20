const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

// Validación por si alguna de las variables está faltando
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY');
}

const client = createClient(supabaseUrl, supabaseKey);

async function procesarMensaje({ phone, location, urbanization, destination }) {
  if (!phone || !location || !urbanization || !destination) {
    throw new Error('Faltan parámetros: phone, location, urbanization o destination');
  }

  const { data, error } = await client
    .from('registros')
    .insert([{ phone, location, urbanization, destination }]);

  if (error) {
    console.error('Error al guardar los datos:', error);
    throw new Error('No se pudo guardar en la base de datos');
  }

  console.log('Datos guardados:', data);
}

module.exports = { procesarMensaje };
