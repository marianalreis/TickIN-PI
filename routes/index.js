const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const Evento = require('../models/eventoModel');
const profileRoutes = require('./profileRoutes');
const apiRoutes = require('./api');

// Usar as rotas de perfil
router.use('/perfil', profileRoutes);

// Rotas da API
router.use('/api', apiRoutes);

// Rota principal - redirecionar para login se não autenticado
router.get('/', (req, res) => {
  if (req.session.usuario) {
    res.redirect(req.session.usuario.tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar');
  } else {
    res.redirect('/login');
  }
});

// Rotas de eventos
router.get('/meusEventos', checkAuth, async (req, res) => {
  if (req.session.usuario.tipo_usuario !== 'organizador') {
    return res.redirect('/pesquisar');
  }
  try {
    const events = await Evento.findByOrganizador(req.session.usuario.id);
    res.render('pages/meusEventos', {
      usuario: req.session.usuario,
      events: events
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.render('pages/meusEventos', {
      usuario: req.session.usuario,
      events: [],
      error: 'Erro ao carregar eventos'
    });
  }
});

router.get('/registrar', checkAuth, (req, res) => {
  if (req.session.usuario.tipo_usuario !== 'organizador') {
    return res.redirect('/pesquisar');
  }
  res.render('pages/registrar', {
    usuario: req.session.usuario,
    isEditing: false
  });
});

// Rotas públicas
router.get('/login', (req, res) => {
  if (req.session.usuario) {
    const redirecionamento = req.session.usuario.tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar';
    res.redirect(redirecionamento);
  } else {
    res.render('pages/login', { 
      pageTitle: 'TickIN - Login',
      error: req.query.error
    });
  }
});

router.get('/cadastro', (req, res) => {
  if (req.session.usuario) {
    const redirecionamento = req.session.usuario.tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar';
    res.redirect(redirecionamento);
  } else {
    res.render('pages/cadastro', { 
      pageTitle: 'TickIN - Cadastro',
      error: req.query.error
    });
  }
});

// Rotas para clientes
router.get('/pesquisar', checkAuth, (req, res) => {
  res.render('pages/pesquisar', { 
    usuario: req.session.usuario 
  });
});

router.get('/minhasInscricoes', checkAuth, async (req, res) => {
  try {
    const inscricoes = await inscricaoController.getMinhasInscricoes(req);
    res.render('pages/minhasInscricoes', { 
      pageTitle: 'TickIN - Minhas Inscrições',
      currentPage: 'minhasInscricoes',
      usuario: req.session.usuario,
      inscricoes: inscricoes
    });
  } catch (error) {
    console.error('Erro ao carregar inscrições:', error);
    res.render('pages/minhasInscricoes', { 
      pageTitle: 'TickIN - Minhas Inscrições',
      currentPage: 'minhasInscricoes',
      usuario: req.session.usuario,
      inscricoes: [],
      error: 'Erro ao carregar inscrições'
    });
  }
});

router.get('/evento/:id', checkAuth, async (req, res) => {
  try {
    const evento = await eventoController.getEventoById(req.params.id);
    if (!evento) {
      return res.status(404).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Evento não encontrado'
      });
    }
    
    res.render('pages/detalhes', { 
      pageTitle: `TickIN - ${evento.title}`,
      evento: evento,
      user: {
        nome: req.session.usuario.nome,
        tipo: req.session.usuario.tipo_usuario
      }
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).render('pages/error', { 
      pageTitle: 'TickIN - Erro',
      message: 'Erro ao carregar evento'
    });
  }
});

router.get('/editar-evento/:id', checkOrganizador, async (req, res) => {
  try {
    const evento = await eventoController.getEventoById(req.params.id);
    if (!evento) {
      return res.status(404).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Evento não encontrado'
      });
    }
    
    // Verificar se o usuário é o organizador do evento
    if (evento.organizador_ID !== req.session.usuario.id) {
      return res.status(403).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Você não tem permissão para editar este evento'
      });
    }
    
    res.render('pages/registrar', { 
      pageTitle: 'TickIN - Editar Evento',
      isEditing: true,
      evento: evento,
      user: {
        nome: req.session.usuario.nome,
        tipo: req.session.usuario.tipo_usuario
      }
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).render('pages/error', { 
      pageTitle: 'TickIN - Erro',
      message: 'Erro ao carregar evento'
    });
  }
});

router.get('/usuarios-inscritos/:id', checkOrganizador, async (req, res) => {
  try {
    const evento = await eventoController.getEventoById(req.params.id);
    if (!evento) {
      return res.redirect('/meusEventos?error=' + encodeURIComponent('Evento não encontrado'));
    }
    
    // Verificar se o usuário é o organizador do evento
    if (evento.organizador_ID !== req.session.usuario.id) {
      return res.redirect('/meusEventos?error=' + encodeURIComponent('Você não tem permissão para ver os inscritos deste evento'));
    }
    
    const inscricoes = await inscricaoController.getInscricoesByEvento(req.params.id);
    res.render('pages/usuariosInscritos', { 
      pageTitle: 'TickIN - Usuários Inscritos',
      evento: evento,
      inscricoes: inscricoes,
      user: {
        nome: req.session.usuario.nome,
        tipo: req.session.usuario.tipo_usuario
      }
    });
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    res.redirect('/meusEventos?error=' + encodeURIComponent('Erro ao carregar inscrições'));
  }
});

// Página de erro 404
router.use((req, res) => {
  res.redirect('/?error=' + encodeURIComponent('A página que você está procurando não existe.'));
});

module.exports = router;
