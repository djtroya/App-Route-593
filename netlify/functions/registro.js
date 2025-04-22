const querystring = require('querystring');
const { getClienteByCedula } = require('./models/clienteModel');

const enviarMensaje = (numero, mensaje) => ({
  statusCode: 200,
  body: JSON.stringify({ reply: mensaje }),
});

exports.handler = async (event) => {
  let datos;
  const ct = event.headers['content-type'] || event.headers['Content-Type'];
  if (ct.includes('application/json')) datos = JSON.parse(event.body);
  else if (ct.includes('application/x-www-form-urlencoded')) datos = querystring.parse(event.body);
  else return { statusCode: 400, body: JSON.stringify({ reply: 'Tipo de contenido no soportado.' }) };

  console.log('Cuerpo recibido:', event.body);
  console.log('Datos parseados:', datos);

  const numero = datos.sender || 'Sin número';
  const texto = String(datos.message || '').trim();

  if (!texto || texto.length !== 10 || !/^\d{10}$/.test(texto)) {
    return enviarMensaje(numero, 'Envía primero tu cédula (10 dígitos).');
  }

  console.log('Cédula recibida:', texto);

  try {
    const cliente = await getClienteByCedula(texto);
    console.log('Resultado de búsqueda en DB:', cliente);

    if (cliente) {
      return enviarMensaje(numero, `Hola ${cliente.nombre}, ya estás registrado. ¿En qué podemos ayudarte?`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: 'No encontramos tu cédula. Completa tu registro aquí:',
        siguientePaso: { tipo: 'FORMULARIO', url: 'https://tusitio.com/registro-cliente' }
      }),
    };
  } catch (error) {
    console.error('Error consultando la base de datos:', error);
    return enviarMensaje(numero, 'Hubo un error consultando tu cédula. Intenta más tarde.');
  }
};
