const supabase = require('@supabase/supabase-js');
const { createClient } = supabase;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

const enviarMensaje = (numero, mensaje) => ({
  statusCode: 200,
  body: JSON.stringify({ reply: mensaje, to: numero }),
});

exports.handler = async (event) => {
  const params = new URLSearchParams(event.body);
  const numero = params.get('phone');
  const mensaje = params.get('message');

  console.log('Cuerpo recibido:', event.body);
  console.log('Número:', numero);
  console.log('Mensaje:', mensaje);

  // Si el mensaje es un número de 10 dígitos (posible cédula)
  if (mensaje.length === 10 && !isNaN(mensaje)) {
    // Verificar si es una cédula registrada en la base de datos
    const { data: clientes, error } = await client
      .from('clientes')
      .select('*')
      .eq('cedula', mensaje);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al consultar la base de datos' }),
      };
    }

    if (clientes.length > 0) {
      // Si se encuentra la cédula en la base de datos
      const mensajeCédula = `Cédula registrada. Nombre: ${clientes[0].nombre}`;
      return enviarMensaje(numero, mensajeCédula);
    } else {
      // Si no se encuentra la cédula, se considera un número de teléfono
      return enviarMensaje(numero, 'Cédula no registrada. ¿En qué puedo ayudarte?');
    }
  } else {
    // Si el mensaje es texto normal (no cédula), respondemos el mensaje directamente
    return enviarMensaje(numero, `Recibido: ${mensaje}`);
  }
};
