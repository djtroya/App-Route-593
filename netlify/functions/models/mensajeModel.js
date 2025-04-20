// netlify/functions/models/mensajeModel.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../../mensajes.json');

const guardarMensaje = (mensajeData) => {
  let mensajes = [];

  if (fs.existsSync(filePath)) {
    mensajes = JSON.parse(fs.readFileSync(filePath));
  }

  mensajes.push({
    mensaje: mensajeData.mensaje,
    numero: mensajeData.numero,
    fecha: new Date().toISOString(),
  });

  fs.writeFileSync(filePath, JSON.stringify(mensajes, null, 2));
};

module.exports = { guardarMensaje };
