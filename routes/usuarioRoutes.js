const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

// Middleware para verificar autenticação
const verificarAutenticacao = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
};

// Middleware para verificar tipo de usuário
const verificarTipoUsuario = (tiposPermitidos) => {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.session.usuario.tipo_usuario)) {
      return res.redirect('/acesso-negado');
    }
    next();
  };
};

// Rotas que não precisam de autenticação
router.post("/register", async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { nome, cpf, telefone, email, senha, tipo_usuario } = req.body;

    // Validações básicas
    if (!nome || !cpf || !telefone || !email || !senha || !tipo_usuario) {
      console.log('Campos faltando:', { nome, cpf, telefone, email, senha: !!senha, tipo_usuario });
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verificar se o CPF já existe
    const cpfExistente = await Usuario.findByCPF(cpf);
    if (cpfExistente) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Criar usuário
    const usuario = await Usuario.create({ nome, cpf, email, telefone, senha, tipo_usuario });
    console.log('Usuário criado:', usuario);

    // Criar sessão
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    };

    // Redirecionar baseado no tipo de usuário
    const redirecionamento = tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar';
    res.json({ success: true, redirect: redirecionamento });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário: ' + error.message });
  }
});

// Rotas que precisam de autenticação
router.get('/perfil', verificarAutenticacao, (req, res) => {
  res.render('pages/perfil');
});

// Rotas protegidas para organizadores
router.get('/meusEventos', verificarAutenticacao, verificarTipoUsuario(['organizador']), (req, res) => {
  res.render('pages/meusEventos');
});

router.get('/registrar', verificarAutenticacao, verificarTipoUsuario(['organizador']), (req, res) => {
  res.render('pages/registrar');
});

router.get('/usuarios-inscritos/:id', verificarAutenticacao, verificarTipoUsuario(['organizador']), (req, res) => {
  res.render('pages/usuariosInscritos');
});

// Rotas protegidas para clientes
router.get('/pesquisar', verificarAutenticacao, verificarTipoUsuario(['cliente']), (req, res) => {
  res.render('pages/pesquisar');
});

router.get('/detalhes/:id', verificarAutenticacao, verificarTipoUsuario(['cliente']), (req, res) => {
  res.render('pages/detalhes');
});

router.get('/minhas-inscricoes', verificarAutenticacao, verificarTipoUsuario(['cliente']), (req, res) => {
  res.render('pages/minhasInscricoes');
});

// Rota de logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
