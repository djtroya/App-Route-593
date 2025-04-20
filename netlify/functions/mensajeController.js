const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

// Función para extraer campos desde el texto del mensaje
const extraerCamposDesdeMensaje = (texto) => {
  const cedula = texto.match(/C[eé]dula:\s*(\d{10})/i)?.[1];
  const ubicacion = texto.match(/Ubicaci[oó]n:\s*(.+?)(?:Urbanizaci[oó]n:|Destino:|$)/i)?.[1]?.trim();
  const urbanizacion = texto.match(/Urbanizaci[oó]n:\s*(.+?)(?:Destino:|$)/i)?.[1]?.trim();
  const destino = texto.match(/Destino:\s*(.+)/i)?.[1]?.trim();
  return { cedula, ubicacion, urbanizacion, destino };
};

async function procesarMensaje({ phone, message }) {
  if (!phone || !message) {
    throw new Error('Faltan parámetros básicos: phone o message');
  }

  // Extraer datos desde el mensaje si están en formato de texto
  const { cedula, ubicacion, urbanizacion, destino } = extraerCamposDesdeMensaje(message);

  // Verificar que no falte nada
  if (!cedula || !ubicacion || !urbanizacion || !destino) {
    throw new Error('Faltan parámetros: cedula, ubicacion, urbanizacion o destino');
  }

  const { data, error } = await client
    .from('clientes')
    .insert([{ cedula, ubicacion, urbanizacion, destino, mensaje: message, telefono: phone }]);

  if (error) {
    console.error('Error al guardar los datos:', error);
    throw new Error('No se pudo guardar en la base de datos');
  }

  console.log('Datos guardados correctamente:', data);
}

module.exports = { procesarMensaje };
