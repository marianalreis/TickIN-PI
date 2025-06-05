const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presencaController');

router.get('/', presencaController.getAllPresencas);
router.get('/:id', presencaController.getPresencaById);
router.get('/inscricao/:compraId', presencaController.getPresencaByInscricao);
router.post('/', presencaController.createPresenca);
router.put('/:id', presencaController.updatePresenca);
router.delete('/:id', presencaController.deletePresenca);

module.exports = router;