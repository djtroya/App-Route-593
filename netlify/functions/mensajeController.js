// netlify/functions/mensajeController.js
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Solo procesamos phone y message por ahora
const procesarMensaje = async (data) => {
  const { phone, message } = data;

  if (!phone || !message) {
    throw new Error('Faltan datos requeridos');
  }

  const { error } = await supabase
    .from('clientes')
    .insert([{
      numero: phone,
      mensaje: message,
      fecharegistro: new Date().toISOString(),
    }]);

  if (error) throw new Error(`Error al guardar en Supabase: ${error.message}`);

  return { status: 'ok', mensaje: 'Mensaje guardado con éxito en Supabase' };
};

module.exports = { procesarMensaje };
