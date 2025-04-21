const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getClienteByCedula(cedula) {
  const { data, error } = await supabase
    .from('clientes')
    .select('cedula, nombre') // solo seleccionamos lo que seguro existe
    .eq('cedula', cedula)
    .limit(1);

  if (error && error.code !== 'PGRST116') {
    console.error('Error en Supabase:', error);
    throw error;
  }

 const cliente = data?.[0] || null;
  console.log('Resultado Supabase:', cliente);
  return cliente;
}

module.exports = { getClienteByCedula };
