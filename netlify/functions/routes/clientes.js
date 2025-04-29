const express = require('express');
const router = express.Router();
const {
  listarClientes,
  editarCliente,
} = require('../controllers/clientesController');

// Ruta para obtener todos los clientes
router.get('/', listarClientes);

// Ruta para editar un cliente por ID
router.put('/:id', editarCliente);

module.exports = router;
