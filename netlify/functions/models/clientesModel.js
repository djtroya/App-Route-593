const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

async function obtenerClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }

  return data;
}

async function actualizarCliente(id, nuevosDatos) {
  const { data, error } = await supabase
    .from('clientes')
    .update(nuevosDatos)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }

  return data;
}

module.exports = {
  obtenerClientes,
  actualizarCliente,
};
