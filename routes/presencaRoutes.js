const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presencaController');
const { checkAuth, checkOrganizador } = require('../middleware/auth');

router.get('/', presencaController.getAllPresencas);
router.get('/:id', presencaController.getPresencaById);
router.get('/inscricao/:compraId', presencaController.getPresencaByInscricao);
router.post('/', presencaController.createPresenca);
router.put('/:id', checkAuth, presencaController.updatePresenca);
router.delete('/:id', presencaController.deletePresenca);

module.exports = router;