const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getClienteByCedula(cedula) {
  const { data, error } = await supabase
    .from('clientes')
    .select('cedula') // solo seleccionamos lo que seguro existe
    .eq('cedula', cedula)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error en Supabase:', error);
    throw error;
  }
  console.log('Resultado Supabase:', data);
  return data;
}

module.exports = { getClienteByCedula };
