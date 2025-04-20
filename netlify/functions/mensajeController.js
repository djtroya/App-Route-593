const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para procesar el mensaje y guardarlo en Supabase
const procesarMensaje = async (data) => {
  console.log('Datos recibidos sin procesar:', JSON.stringify(data));

  if (!data.cedula || !data.ubicacion || !data.urbanizacion || !data.destino || !data.mensaje || !data.numero) {
    throw new Error('Faltan datos requeridos');
  }

  const { error } = await supabase
    .from('clientes')
    .insert([{
      cedula: data.cedula,
      ubicacion: data.ubicacion,
      urbanizacion: data.urbanizacion,
      destino: data.destino,
      mensaje: data.mensaje,
      numero: data.numero,
      fecharegistro: new Date().toISOString(),
    }]);

  if (error) {
    throw new Error(`Error al guardar en Supabase: ${error.message}`);
  }

  return { status: 'ok', mensaje: 'Mensaje guardado con éxito en Supabase' };
};

// Asegúrate de exportar la función procesarMensaje
module.exports = { procesarMensaje };
