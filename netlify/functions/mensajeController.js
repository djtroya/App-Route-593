// netlify/functions/mensajeController.js
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL; // Tu URL de Supabase
const supabaseKey = process.env.SUPABASE_API_KEY; // Tu API key de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para procesar el mensaje y guardarlo en Supabase
const procesarMensaje = async (data) => {
  // Verificación de los datos requeridos
  if (!data.mensaje || !data.numero || !data.cedula || !data.ubicacion || !data.urbanizacion || !data.destino) {
    throw new Error('Faltan datos requeridos');
  }

  // Guardar los datos en Supabase (en la tabla 'clientes')
  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert([
      {
        cedula: data.cedula,
        ubicacion: data.ubicacion,
        urbanizacion: data.urbanizacion,
        destino: data.destino,
        mensaje: data.mensaje,
        numero: data.numero,
        fecharegistro: new Date().toISOString(),
      },
    ]);

  if (error) {
    throw new Error(`Error al guardar en Supabase: ${error.message}`);
  }

  return { status: 'ok', mensaje: 'Mensaje guardado con éxito en Supabase' };
};

module.exports = { procesarMensaje };
