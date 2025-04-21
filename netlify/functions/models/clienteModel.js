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
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('cedula, nombre')
      .eq('cedula', cedula)
      .maybeSingle(); // más seguro que single()

    if (error) {
      console.error('Error en Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error inesperado en getClienteByCedula:', err.message);
    return null;
  }
}

module.exports = { getClienteByCedula };
