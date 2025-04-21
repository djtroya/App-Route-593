// clienteModel.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Obtiene un cliente por su cédula.
 * @param {string} cedula - Cédula de 10 dígitos.
 * @returns {Promise<Object|null>} - Objeto cliente con { cedula, nombre } o null si no existe.
 */
async function getClienteByCedula(cedula) {
  const { data, error } = await supabase
    .from('clientes')
    .select('cedula, nombre')
    .eq('cedula', cedula)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

module.exports = { getClienteByCedula };
