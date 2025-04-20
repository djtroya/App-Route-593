// netlify/functions/models/mensajeModel.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const guardarMensaje = async (mensajeData) => {
  const { data, error } = await supabase
    .from('mensajes')
    .insert([
      {
        mensaje: mensajeData.mensaje,
        numero: mensajeData.numero,
        fecha: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error('Error al guardar mensaje en Supabase:', error);
    throw new Error('No se pudo guardar el mensaje');
  }

  console.log('Mensaje guardado en Supabase:', data);
};

module.exports = { guardarMensaje };
