const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de teste funcionando!' });
});

// Rota para registro
router.post('/register', (req, res) => {
  console.log('Rota de registro simples acionada');
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'Registro simulado com sucesso',
    redirect: '/login'
  });
});

module.exports = router;