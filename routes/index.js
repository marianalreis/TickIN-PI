const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rotas para o CRUD de usuários
router.post('/users', UserController.criarUsuario);
router.get('/users', UserController.listarUsuarios);
router.put('/users/:id', UserController.editarUsuario);
router.delete('/users/:id', UserController.excluirUsuario);

module.exports = router;
