const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');

router.get('/', inscricaoController.getAllInscricoes);
router.get('/:id', inscricaoController.getInscricaoById);
router.get('/usuario/:cpf', inscricaoController.getInscricoesByUsuario);
router.get('/evento/:eventoId', inscricaoController.getInscricoesByEvento);
router.post('/', inscricaoController.createInscricao);
router.put('/:id', inscricaoController.updateInscricao);
router.delete('/:id', inscricaoController.deleteInscricao);

module.exports = router;