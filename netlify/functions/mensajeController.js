// netlify/functions/mensajeController.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Detectar campos desde el mensaje con formato: "cedula;ubicacion;urbanizacion;destino"
const procesarMensaje = async (data) => {
  console.log("Datos recibidos:", data);

  const { phone, message } = data;

  if (!phone || !message) {
    throw new Error('Faltan parámetros: phone o message');
  }

  // Separar el mensaje por punto y coma
  const partes = message.split(';');
  if (partes.length < 4) {
    throw new Error('Formato de mensaje incorrecto. Esperado: cedula;ubicacion;urbanizacion;destino');
  }

  const [cedula, ubicacion, urbanizacion, destino] = partes;

  const { error } = await supabase
    .from('clientes')
    .insert([{
      cedula,
      ubicacion,
      urbanizacion,
      destino,
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
