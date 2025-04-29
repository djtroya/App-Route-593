const { obtenerClientes, actualizarCliente } = require('../models/clientesModel');

async function listarClientes(req, res) {
  try {
    const clientes = await obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los datos de clientes' });
  }
}

async function editarCliente(req, res) {
  const { id } = req.params;
  const nuevosDatos = req.body;

  if (!id || !nuevosDatos) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios' });
  }

  try {
    const resultado = await actualizarCliente(id, nuevosDatos);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el cliente' });
  }
}

module.exports = {
  listarClientes,
  editarCliente,
};
