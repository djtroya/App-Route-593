const enviarMensaje = (numero, mensaje) => ({
  statusCode: 200,
  body: JSON.stringify({ reply: mensaje }),
});

exports.handler = async (event) => {
  console.log('Cuerpo recibido:', event.body);
  return enviarMensaje('0000000000', '¡Hola! Esta es una respuesta de prueba desde el backend.');
};
