exports.handler = async (event) => {
  const params = new URLSearchParams(event.body);
  const numero = params.get('phone');
  const mensaje = params.get('message');

  console.log('Cuerpo recibido:', event.body);
  console.log('Número:', numero);
  console.log('Mensaje:', mensaje);

  const respuesta = `Recibido: ${mensaje}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: respuesta,
      to: numero,
    }),
  };
};
