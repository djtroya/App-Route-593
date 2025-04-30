const { obtenerClientes, actualizarCliente } = require('../models/clientesModel');

async function handler(event) {
  try {
    if (event.httpMethod === 'GET') {
      const clientes = await obtenerClientes();
      return {
        statusCode: 200,
        body: JSON.stringify(clientes),
      };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body);
      const { id, ...nuevosDatos } = body;

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Falta el ID del cliente' }),
        };
      }

      const resultado = await actualizarCliente(id, nuevosDatos);
      return {
        statusCode: 200,
        body: JSON.stringify(resultado),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  } catch (error) {
    console.error('Error en handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
}

module.exports = { handler };
