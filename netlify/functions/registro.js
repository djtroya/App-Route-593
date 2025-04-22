const querystring = require('querystring');
const { getClienteByCedula } = require('./models/clienteModel');

const enviarMensaje = (numero, mensaje) => ({
  statusCode: 200,
  body: JSON.stringify({ reply: mensaje }),
});

exports.handler = async (event) => {
  let datos;
  const ct = event.headers?.['content-type'] || event.headers?.['Content-Type'] || ''; // CORREGIDO

  if (ct.includes('application/json') && event.body) datos = JSON.parse(event.body); // CORREGIDO
  else if (ct.includes('application/x-www-form-urlencoded') && event.body) datos = querystring.parse(event.body); // CORREGIDO
  else return { statusCode: 400, body: JSON.stringify({ reply: 'Tipo de contenido no soportado o vacío.' }) }; // CORREGIDO

  console.log('Cuerpo recibido:', event.body); // NUEVA línea
  console.log('Datos parseados:', datos);      // NUEVA línea

  // Si no hay número, vamos a usar el campo `message` como la cédula
  const numero = datos.sender || 'Sin número';
  const texto = String(datos.message || '').trim();
  if (!texto || texto.length !== 10 || !/^\d{10}$/.test(texto)) {
    return enviarMensaje(numero, 'Envía primero tu cédula (10 dígitos).');
  }

  const cliente = await getClienteByCedula(texto);
  console.log('Cédula recibida:', texto);
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
};
