exports.handler = async (event) => {
  const params = new URLSearchParams(event.body);
  const numero = params.get('phone');
  const mensaje = params.get('message');

  console.log('Cuerpo recibido:', event.body);
  console.log('Número:', numero);
  console.log('Mensaje:', mensaje);

  // Verificar si el número es válido
  if (!numero || isNaN(numero)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ reply: "Número de teléfono no válido. Por favor, ingresa un número correcto." }),
    };
  }

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
