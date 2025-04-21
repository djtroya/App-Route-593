const querystring = require('querystring');
const { getClienteByCedula } = require('./models/clienteModel');

const enviarMensaje = (numero, mensaje) => ({
  statusCode: 200,
  body: JSON.stringify({ reply: mensaje }),
});

exports.handler = async (event) => {
  try {
    let datos;
    const ct = event.headers['content-type'] || event.headers['Content-Type'];

    if (ct.includes('application/json')) {
      datos = JSON.parse(event.body);
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      datos = querystring.parse(event.body);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: 'Tipo de contenido no soportado.' }),
      };
    }

    const numero = datos.sender || datos.numero;
    const texto = datos.message?.trim();

    if (!numero || !texto) {
      return enviarMensaje(numero, 'Envía primero tu cédula (10 dígitos).');
    }

    if (/^\d{10}$/.test(texto)) {
      const cliente = await getClienteByCedula(texto);
      if (cliente) {
        return enviarMensaje(
          numero,
          `Hola ${cliente.nombre}, ya estás registrado. ¿En qué podemos ayudarte?`
        );
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({
            reply: 'No encontramos tu cédula. Completa tu registro aquí:',
            siguientePaso: {
              tipo: 'FORMULARIO',
              url: 'https://tusitio.com/registro-cliente', // Puedes cambiar esta URL
            },
          }),
        };
      }
    }

    return enviarMensaje(numero, 'Para comenzar, envía tu cédula (10 dígitos).');
  } catch (error) {
    console.error('Error en handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error interno del servidor.' }),
    };
  }
};
