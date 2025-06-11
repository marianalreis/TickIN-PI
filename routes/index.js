const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const Evento = require('../models/eventoModel');
const profileRoutes = require('./profileRoutes');
const apiRoutes = require('./api');
const Inscricao = require('../models/inscricaoModel');

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
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).render('pages/error', { 
        message: 'Evento não encontrado'
      });
    }
    
    // Verifica se o usuário logado é o organizador do evento
    console.log('Dados do usuário:', {
      session: req.session,
      usuario: req.session.usuario,
      id: req.session.usuario?.id,
      tipo: req.session.usuario?.tipo_usuario
    });
    
    console.log('Dados do evento:', {
      evento_completo: evento,
      id: evento.id,
      usuario_id: evento.usuario_id
    });
    
    const isOrganizador = req.session.usuario && 
                         req.session.usuario.tipo_usuario === 'organizador' &&
                         evento.usuario_id && 
                         Number(evento.usuario_id) === Number(req.session.usuario.id);
    
    console.log('Comparação:', {
      usuario_logado: req.session.usuario?.id,
      tipo_usuario: req.session.usuario?.tipo_usuario,
      usuario_evento: evento.usuario_id,
      isOrganizador: isOrganizador
    });
    
    // Renderiza a view apropriada baseado no tipo de usuário
    const template = isOrganizador ? 'pages/detalhesOrganizador' : 'pages/detalhes';
    
    console.log('Template selecionado:', template);
    
    res.render(template, { 
      event: evento,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).render('pages/error', { 
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

// Página de erro 404
router.use((req, res) => {
  res.redirect('/?error=' + encodeURIComponent('A página que você está procurando não existe.'));
});

module.exports = router;
