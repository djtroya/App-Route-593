// /netlify/functions/routes/clientes.js
const { handler } = require('./controllers/clientesController');

exports.handler = async (event, context) => {
  return handler(event, context);
};
