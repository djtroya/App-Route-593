const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

async function guardarDato(numero, campo, valor) {
  // Verifica si el número ya existe
  const { data: existente } = await client
    .from('clientes')
    .select('*')
    .eq('numero', numero)
    .single();

  if (existente) {
    // Actualiza solo el campo nuevo
    const { error } = await client
      .from('clientes')
      .update({ [campo]: valor })
      .eq('numero', numero);

    if (error) throw error;
  } else {
    // Crea un nuevo registro con el campo inicial
    const { error } = await client
      .from('clientes')
      .insert([{ numero, [campo]: valor }]);

    if (error) throw error;
  }
}

async function obtenerCliente(numero) {
  const { data } = await client
    .from('clientes')
    .select('*')
    .eq('numero', numero)
    .single();

  return data;
}

module.exports = { guardarDato, obtenerCliente };
