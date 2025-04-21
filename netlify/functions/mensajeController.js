const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

// Extraer campos si vienen en un solo mensaje
const extraerCamposDesdeMensaje = (texto) => {
  const cedula = texto.match(/C[eé]dula:\s*(\d{10})/i)?.[1];
  const ubicacion = texto.match(/Ubicaci[oó]n:\s*(.+?)(?:Urbanizaci[oó]n:|Destino:|$)/i)?.[1]?.trim();
  const urbanizacion = texto.match(/Urbanizaci[oó]n:\s*(.+?)(?:Destino:|$)/i)?.[1]?.trim();
  const destino = texto.match(/Destino:\s*(.+)/i)?.[1]?.trim();
  return { cedula, ubicacion, urbanizacion, destino };
};

async function procesarMensaje({ numero, message }) {
  if (!numero || !message) {
    throw new Error('Faltan parámetros básicos: numero o message');
  }

  // Verificar si ya existe registro
  let { data: registros, error } = await client
    .from('clientes')
    .select('*')
    .eq('numero', numero)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw new Error('Error al consultar Supabase');

  const registro = registros?.[0] || {};
  const extraidos = extraerCamposDesdeMensaje(message);

  // Priorizar lo nuevo si se escribió explícitamente
  const cedula = extraidos.cedula || registro.cedula;
  const ubicacion = extraidos.ubicacion || registro.ubicacion;
  const urbanizacion = extraidos.urbanizacion || registro.urbanizacion;
  const destino = extraidos.destino || registro.destino;

  // Verificar qué falta
  if (!cedula) throw new Error('cedula');
  if (!ubicacion) throw new Error('ubicacion');
  if (!urbanizacion) throw new Error('urbanizacion');
  if (!destino) throw new Error('destino');

  // Ya tiene todo: guardamos
  const { error: insertError } = await client
    .from('clientes')
    .insert([{ numero, cedula, ubicacion, urbanizacion, destino, mensaje: message }]);

  if (insertError) {
    console.error('Error al guardar en Supabase:', insertError);
    throw new Error('error_guardando');
  }

  return { exito: true };
}

module.exports = { procesarMensaje };
