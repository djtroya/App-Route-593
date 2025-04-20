const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// Verifica si el cliente ya existe
async function obtenerCliente(phone) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('numero', phone)
    .single();

  return { data, error };
}

// Guarda o actualiza los datos
async function guardarCliente(datos) {
  const { data: existente } = await supabase
    .from('clientes')
    .select('*')
    .eq('numero', datos.numero)
    .single();

  if (existente) {
    const { error } = await supabase
      .from('clientes')
      .update(datos)
      .eq('numero', datos.numero);
    return error;
  } else {
    const { error } = await supabase
      .from('clientes')
      .insert([datos]);
    return error;
  }
}

// Procesa el mensaje recibido
const procesarMensaje = async (data) => {
  const phone = data.phone;
  const mensaje = (data.message || '').trim();

  if (!phone || !mensaje) {
    throw new Error('Faltan parámetros: phone o message');
  }

  const { data: cliente } = await obtenerCliente(phone);

  const nuevoDato = { numero: phone, mensaje, fecharegistro: new Date().toISOString() };

  if (!cliente) {
    // Primer contacto: pedimos la cédula
    await guardarCliente(nuevoDato);
    return { respuesta: '¡Hola! Bienvenido a Route 593. Por favor, envía tu número de cédula (10 dígitos).' };
  }

  if (!cliente.cedula) {
    if (!/^\d{10}$/.test(mensaje)) {
      return { respuesta: 'Tu cédula debe tener 10 dígitos. Por favor, intenta nuevamente.' };
    }
    await guardarCliente({ ...cliente, cedula: mensaje });
    return { respuesta: 'Gracias. Ahora, por favor indícanos tu ubicación actual o urbanización.' };
  }

  if (!cliente.ubicacion) {
    await guardarCliente({ ...cliente, ubicacion: mensaje });
    return { respuesta: 'Anotado. ¿Desde qué urbanización o punto exacto sales?' };
  }

  if (!cliente.urbanizacion) {
    await guardarCliente({ ...cliente, urbanizacion: mensaje });
    return { respuesta: 'Perfecto. ¿Hacia qué destino deseas ir?' };
  }

  if (!cliente.destino) {
    await guardarCliente({ ...cliente, destino: mensaje });
    return {
      respuesta: '¡Registro completo! En breve un operador de Route 593 tomará tu solicitud. Gracias por confiar en nosotros.'
    };
  }

  return { respuesta: 'Ya tenemos tus datos. Si necesitas cambiar algo, por favor indícalo.' };
};

module.exports = { procesarMensaje };
