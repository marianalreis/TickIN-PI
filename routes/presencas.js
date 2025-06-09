const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');

// API para marcar presença
router.post('/', checkOrganizador, (req, res) => {
  const { inscricaoId, presente } = req.body;
  
  res.json({
    success: true,
    message: `Presença ${presente ? 'confirmada' : 'removida'} com sucesso`,
    inscricaoId,
    presente
  });
});

// API para obter presença por inscrição
router.get('/inscricao/:id', checkOrganizador, (req, res) => {
  res.json({
    inscricaoId: req.params.id,
    presente: true,
    dataHora: new Date()
  });
});

module.exports = router;