const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');
const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento');
const Inscricao = require('../models/Inscricao');
const Presenca = require('../models/Presenca');
const pool = require('../config/database');

// API de autenticação
router.post('/usuarios/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário pelo email
    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    
    // Verificar senha
    const senhaCorreta = await Usuario.validatePassword(password, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    
    // Verificar se é organizador
    const isOrganizador = await Usuario.isOrganizador(usuario.CPF);
    
    // Configurar sessão
    req.session.userId = usuario.CPF;
    req.session.userEmail = usuario.email;
    req.session.userName = usuario.nome;
    req.session.userType = isOrganizador ? 'organizador' : 'cliente';
    
    if (isOrganizador) {
      // Buscar ID do organizador
      const organizadorQuery = await pool.query('SELECT organizador_ID FROM organizadores WHERE CPF = $1', [usuario.CPF]);
      req.session.organizadorId = organizadorQuery.rows[0]?.organizador_ID;
    }
    
    const redirect = isOrganizador ? '/meusEventos' : '/pesquisar';
    
    res.json({ 
      message: 'Login realizado com sucesso',
      redirect: redirect,
      user: {
        nome: usuario.nome,
        email: usuario.email,
        tipo: req.session.userType
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// API de cadastro
router.post('/usuarios/register', async (req, res) => {
  try {
    const { nome, email, cpf, telefone, endereco, password, userType } = req.body;
    
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
    const novoUsuario = await Usuario.create({
      cpf,
      nome,
      email,
      telefone,
      endereco,
      senha: password,
      tipo_usuario: userType
    });
    
    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso',
      redirect: '/login'
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// API de eventos
router.post('/eventos', checkAuth, async (req, res) => {
  try {
    const { title, description, date, time, location, price } = req.body;
    
    // Buscar ID do organizador
    const cpf = req.session.userId;
    const organizadorQuery = await pool.query('SELECT organizador_ID FROM organizadores WHERE CPF = $1', [cpf]);
    const organizadorId = organizadorQuery.rows[0]?.organizador_ID;
    
    if (!organizadorId) {
      return res.status(403).json({ message: 'Apenas organizadores podem criar eventos' });
    }
    
    // Criar evento
    const novoEvento = await Evento.create({
      data: date,
      descricao: `${title}\n${description}`,
      valor: price,
      local: location,
      horario: time,
      organizador_ID: organizadorId
    });
    
    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      redirect: '/meusEventos',
      evento: novoEvento
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao criar evento' 
    });
  }
});

// API para atualizar evento
router.put('/eventos/:id', checkAuth, async (req, res) => {
  try {
    const { title, description, date, time, location, price } = req.body;
    
    // Verificar se o evento existe
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Verificar se o usuário é o organizador do evento
    const cpf = req.session.userId;
    const organizadorQuery = await pool.query('SELECT organizador_ID FROM organizadores WHERE CPF = $1', [cpf]);
    const organizadorId = organizadorQuery.rows[0]?.organizador_ID;
    
    if (evento.organizador_ID !== organizadorId) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este evento' });
    }
    
    // Atualizar evento
    const eventoAtualizado = await Evento.update(req.params.id, {
      data: date,
      descricao: `${title}\n${description}`,
      valor: price,
      local: location,
      horario: time
    });
    
    res.json({
      success: true,
      message: 'Evento atualizado com sucesso',
      redirect: '/meusEventos',
      evento: eventoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao atualizar evento' 
    });
  }
});

// API para inscrição em evento
router.post('/inscricoes', checkAuth, async (req, res) => {
  try {
    const { eventoId } = req.body;
    const cpf = req.session.userId;
    
    // Verificar se o evento existe
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Verificar se o usuário já está inscrito
    const jaInscrito = await Inscricao.verificarInscricao(cpf, eventoId);
    if (jaInscrito) {
      return res.status(400).json