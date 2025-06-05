const express = require('express');
const router = express.Router();
const organizadorController = require('../controllers/organizadorController');

router.get('/', organizadorController.getAllOrganizadores);
router.get('/:id', organizadorController.getOrganizadorById);
router.post('/', organizadorController.createOrganizador);
router.put('/:id', organizadorController.updateOrganizador);
router.delete('/:id', organizadorController.deleteOrganizador);

module.exports = router;