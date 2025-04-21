const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

async function guardarDato(numero, campo, valor) {
  try {
    const { data: existente, error: errorExistente } = await client
      .from('clientes')
      .select('*')
      .eq('numero', numero)
      .single();

    if (errorExistente && errorExistente.code !== 'PGRST116') {
      throw new Error(Error al verificar existencia: ${errorExistente.message});
    }

    if (existente) {
      const { error: errorUpdate } = await client
        .from('clientes')
        .update({ [campo]: valor })
        .eq('numero', numero);

      if (errorUpdate) {
        throw new Error(Error al actualizar: ${errorUpdate.message});
      }
    } else {
      const { error: errorInsert } = await client
        .from('clientes')
        .insert([{ numero, [campo]: valor }]);

      if (errorInsert) {
        throw new Error(Error al insertar: ${errorInsert.message});
      }
    }
  } catch (err) {
    throw new Error(`guardarDato() falló: ${err.message}`);
  }
}

async function obtenerCliente(numero) {
  try {
    const { data, error } = await client
      .from('clientes')
      .select('*')
      .eq('numero', numero)
      .single();

    if (error) throw new Error(Error al obtener cliente: ${error.message});
    return data;
  } catch (err) {
    throw new Error(obtenerCliente() falló: ${err.message});
  }
}

module.exports = { guardarDato, obtenerCliente };
