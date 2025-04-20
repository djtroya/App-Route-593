// netlify/functions/controllers/mensajeController.js
const { guardarMensaje } = require('../models/mensajeModel');

const procesarMensaje = async (data) => {
  if (!data.mensaje || !data.numero) {
    throw new Error('Faltan datos requeridos');
  }

  guardarMensaje(data);

  return { status: 'ok', mensaje: 'Mensaje guardado con éxito' };
};

module.exports = { procesarMensaje };
