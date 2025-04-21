// clienteModel.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Obtiene un cliente por su cédula.
 */
async function getClienteByCedula(cedula) {
  const { data, error } = await supabase
    .from('clientes')
    .select('cedula, numero') // columnas reales
    .eq('cedula', cedula)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error('Error en Supabase:', error);
    throw error;
  }
  return data;
}

module.exports = { getClienteByCedula };
