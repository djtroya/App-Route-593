const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

async function procesarMensaje(datos) {
  const {
    phone,
    message,
    cedula,
    ubicacion,
    urbanizacion,
    destino
  } = datos;

  // Validación de campos obligatorios
  if (!phone || !message) {
    throw new Error('Faltan parámetros básicos: phone o message');
  }

  if (!cedula || !ubicacion || !urbanizacion || !destino) {
    throw new Error('Faltan parámetros: cedula, ubicacion, urbanizacion o destino');
  }

  // Validación específica de la cédula
  if (!/^\d{10}$/.test(cedula)) {
    throw new Error('Cédula inválida: debe contener exactamente 10 dígitos numéricos');
  }

  const { data, error } = await client
    .from('clientes')
    .insert([{
      cedula,
      ubicacion,
      destino,
      urbanizacion,
      mensaje: message,
      numero: phone
    }]);

  if (error) {
    console.error('Error al guardar los datos:', error);
    throw new Error('No se pudo guardar en la base de datos');
  }

  console.log('Datos guardados exitosamente:', data);
}

module.exports = { procesarMensaje };
