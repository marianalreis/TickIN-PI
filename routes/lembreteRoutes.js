const express = require('express');
const router = express.Router();
const lembreteController = require('../controllers/lembreteController');

router.get('/', lembreteController.getAllLembretes);
router.get('/:id', lembreteController.getLembreteById);
router.get('/usuario/:cpf', lembreteController.getLembretesByUsuario);
router.get('/evento/:eventoId', lembreteController.getLembretesByEvento);
router.post('/', lembreteController.createLembrete);
router.put('/:id', lembreteController.updateLembrete);
router.delete('/:id', lembreteController.deleteLembrete);

module.exports = router;