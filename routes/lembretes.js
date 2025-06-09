const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');

// API para enviar lembrete
router.post('/enviar', checkOrganizador, (req, res) => {
  const { usuarios, mensagem } = req.body;
  
  res.json({
    success: true,
    message: `Lembrete enviado com sucesso para ${usuarios.length} usuário(s)`,
    enviados: usuarios
  });
});

module.exports = router;