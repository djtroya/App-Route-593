const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const procesarMensaje = async (data) => {
  console.log('Datos recibidos:', data);

  const { message, phone } = data;

  if (!message || !phone) {
    throw new Error('Faltan parámetros: phone o message');
  }

  const { error } = await supabase
    .from('clientes')
    .insert([{
      mensaje: message,
      numero: phone,
      fecharegistro: new Date().toISOString(),
    }]);

  if (error) {
    throw new Error(`Error al guardar en Supabase: ${error.message}`);
  }

  return { status: 'ok', mensaje: 'Mensaje guardado con éxito en Supabase' };
};

module.exports = { procesarMensaje };
