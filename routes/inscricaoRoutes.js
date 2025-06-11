const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');
const { checkAuth } = require('../middlewares/auth');

// Rotas protegidas por autenticação
router.use(checkAuth);

// Listar todas as inscrições (admin)
router.get('/', inscricaoController.getAllInscricoes);

// Listar inscrições por evento
router.get('/evento/:eventoId', inscricaoController.getInscricoesByEvento);

// Listar minhas inscrições
router.get('/minhas', inscricaoController.getMinhasInscricoes);

// Criar nova inscrição
router.post('/', inscricaoController.createInscricao);

// Cancelar inscrição
router.delete('/:id', inscricaoController.cancelarInscricao);

module.exports = router;