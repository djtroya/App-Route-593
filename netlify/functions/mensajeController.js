const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

// Obtener las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Agregar logs para verificar si las variables están siendo cargadas correctamente
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

// Crear el cliente de Supabase
const client = createClient(supabaseUrl, supabaseKey);

async function procesarMensaje({ phone, location, urbanization, destination }) {
  // Verificamos que los datos no falten
  if (!phone || !location || !urbanization || !destination) {
    throw new Error('Faltan parámetros: phone, location, urbanization o destination');
  }

  // Guardamos los datos en Supabase
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
