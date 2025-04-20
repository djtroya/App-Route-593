const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para procesar el mensaje desde WhatsAuto
const procesarMensaje = async (data) => {
  const numero = data.phone;
  const mensaje = data.message?.trim();

  if (!numero || !mensaje) {
    throw new Error('Faltan parámetros: phone o message');
  }

  // Buscar si ya existe el cliente
  const { data: registros, error: errorBusqueda } = await supabase
    .from('clientes')
    .select('*')
    .eq('numero', numero)
    .order('fecharegistro', { ascending: false })
    .limit(1);

  if (errorBusqueda) {
    throw new Error(`Error buscando cliente: ${errorBusqueda.message}`);
  }

  const cliente = registros[0];

  // Si no existe, asumimos que es la primera vez y pedimos cédula
  if (!cliente) {
    return {
      respuesta: '¡Hola! Bienvenido a *Route 593*. Para comenzar, por favor envíame tu número de cédula (10 dígitos).',
      accion: 'esperando_cedula'
    };
  }

  // Si no tiene cédula guardada, intentamos validarla
  if (!cliente.cedula) {
    const cedulaValida = /^\d{10}$/.test(mensaje);
    if (!cedulaValida) {
      return {
        respuesta: 'Tu cédula debe tener exactamente 10 dígitos. Por favor, vuelve a intentarlo.',
        accion: 'cedula_invalida'
      };
    }

    const { error } = await supabase
      .from('clientes')
      .update({ cedula: mensaje })
      .eq('numero', numero);

    if (error) throw new Error(`Error guardando cédula: ${error.message}`);

    return {
      respuesta: '¡Gracias! Ahora indícame tu ubicación o urbanización actual.',
      accion: 'esperando_ubicacion'
    };
  }

  // Si no tiene ubicación
  if (!cliente.ubicacion) {
    const { error } = await supabase
      .from('clientes')
      .update({ ubicacion: mensaje })
      .eq('numero', numero);

    if (error) throw new Error(`Error guardando ubicación: ${error.message}`);

    return {
      respuesta: 'Perfecto. Ahora, ¿cuál es tu destino?',
      accion: 'esperando_destino'
    };
  }

  // Si no tiene destino
  if (!cliente.destino) {
    const { error } = await supabase
      .from('clientes')
      .update({ destino: mensaje, fecharegistro: new Date().toISOString() })
      .eq('numero', numero);

    if (error) throw new Error(`Error guardando destino: ${error.message}`);

    return {
      respuesta: '¡Registro completo! En breve un conductor de *Route 593* se comunicará contigo.',
      accion: 'registro_completo'
    };
  }

  // Ya tiene todo, guardar mensaje adicional si se quiere registrar una nota
  await supabase.from('clientes').insert([{
    numero,
    mensaje,
    fecharegistro: new Date().toISOString()
  }]);

  return {
    respuesta: '¡Hola nuevamente! Ya tenemos tus datos registrados. Si deseas cambiar algo, solo escribe.',
    accion: 'ya_registrado'
  };
};

module.exports = { procesarMensaje };
