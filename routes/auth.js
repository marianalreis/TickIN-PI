const express = require('express');
const router = express.Router();

// Rota de login
router.get('/login', (req, res) => {
  res.render('pages/login', { pageTitle: 'TickIN - Login' });
});

// Rota de cadastro
router.get('/cadastro', (req, res) => {
  res.render('pages/cadastro', { pageTitle: 'TickIN - Cadastro' });
});

// Rota de pesquisa (página inicial após login para clientes)
router.get('/pesquisar', (req, res) => {
  res.render('pages/pesquisar', { pageTitle: 'TickIN - Pesquisar Eventos' });
});

// API de login
router.post('/api/usuarios/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulação de login
  const isOrganizador = email.includes('org');
  
  // Salvar na sessão
  req.session.userId = '12345';
  req.session.userType = isOrganizador ? 'organizador' : 'cliente';
  req.session.userName = isOrganizador ? 'Organizador Demo' : 'Cliente Demo';
  
  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    redirect: isOrganizador ? '/meusEventos' : '/pesquisar'
  });
});

// API de cadastro
router.post('/api/usuarios/register', (req, res) => {
  // Simulação de cadastro
  res.json({
    success: true,
    message: 'Cadastro realizado com sucesso',
    redirect: '/login'
  });
});

// API de logout
router.post('/api/usuarios/logout', (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
    redirect: '/login'
  });
});

module.exports = router;