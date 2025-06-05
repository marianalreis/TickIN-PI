const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

// Listar todos os eventos
router.get('/', eventoController.listarEventos);

// Obter um evento específico
router.get('/:id', eventoController.obterEventoPorId);

// Criar um novo evento
router.post('/', eventoController.criarEvento);

// Atualizar um evento
router.put('/:id', eventoController.atualizarEvento);

// Excluir um evento
router.delete('/:id', eventoController.excluirEvento);

module.exports = router;

