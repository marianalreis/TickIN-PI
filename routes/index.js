const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const Evento = require('../models/eventoModel');
const profileRoutes = require('./profileRoutes');
const apiRoutes = require('./api');
const Inscricao = require('../models/inscricaoModel');
const Presenca = require('../models/presencaModel');

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
  console.log('==== INÍCIO DA ROTA /evento/:id ====');
  console.log('ID do evento solicitado:', req.params.id);
  console.log('Usuário na sessão:', req.session.usuario);
  try {
    const evento = await Evento.findById(req.params.id);
    console.log('Evento encontrado:', evento);
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
    
    // Verificações separadas para facilitar debug
    const usuarioLogado = !!req.session.usuario;
    const tipoCorreto = req.session.usuario?.tipo_usuario === 'organizador';
    const temUsuarioId = !!evento.usuario_id;
    const idsCorrespondem = Number(evento.usuario_id) === Number(req.session.usuario?.id);
    
    console.log('Verificações individuais:', {
      usuarioLogado,
      tipoCorreto,
      temUsuarioId,
      idsCorrespondem,
      'evento.usuario_id': evento.usuario_id,
      'session.usuario.id': req.session.usuario?.id
    });
    
    const isOrganizador = usuarioLogado && tipoCorreto && temUsuarioId && idsCorrespondem;
    
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
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Evento não encontrado'
      });
    }
    
    // Verificar se o usuário é o organizador do evento
    if (Number(evento.usuario_id) !== Number(req.session.usuario.id)) {
      return res.status(403).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Você não tem permissão para editar este evento'
      });
    }
    
    res.render('pages/registrar', { 
      pageTitle: 'TickIN - Editar Evento',
      isEditing: true,
      event: {
        id: evento.id,
        titulo: evento.titulo,
        descricao: evento.descricao,
        data: (typeof evento.data === 'string' ? evento.data.split('T')[0] : evento.data.toISOString().split('T')[0]),
        horario: evento.horario,
        local: evento.local,
        imagem: evento.imagem
      },
      usuario: req.session.usuario
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
  console.log('ROTA /usuarios-inscritos/:id - req.session.usuario:', req.session.usuario);
  const evento = await Evento.findById(req.params.id);
  console.log('Evento encontrado:', evento);
  console.log('Comparando IDs:', {
    'evento.usuario_id': evento?.usuario_id,
    'session.usuario.id': req.session.usuario.id,
    'match': Number(evento?.usuario_id) === Number(req.session.usuario.id)
  });
    console.log('ROTA /usuarios-inscritos/:id - req.session.usuario:', req.session.usuario);
  console.log('==== INÍCIO DA ROTA /usuarios-inscritos/:id ====');
  console.log('ID do evento solicitado:', req.params.id);
  console.log('Usuário na sessão:', req.session.usuario);
  try {
    const evento = await Evento.findById(req.params.id);
    console.log('Evento encontrado:', evento);
    if (!evento) {
      return res.status(404).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Evento não encontrado'
      });
    }
    
    // Verificar se o usuário é o organizador do evento
    console.log('Comparando IDs:', {
      'evento.usuario_id': evento.usuario_id,
      'session.usuario.id': req.session.usuario.id,
      'match': Number(evento.usuario_id) === Number(req.session.usuario.id)
    });

    if (Number(evento.usuario_id) !== Number(req.session.usuario.id)) {
      return res.status(403).render('pages/error', { 
        pageTitle: 'TickIN - Erro',
        message: 'Você não tem permissão para ver os inscritos deste evento'
      });
    }
    
    const inscricoes = await Inscricao.findByEvento(req.params.id);
    console.log('Inscrições encontradas:', inscricoes);
    
    // Buscar presenças do evento
    const presencas = await Presenca.findByEvento(req.params.id);
    // Mapear presenças por CPF ou email (ajuste conforme o campo em comum)
    const presencaMap = {};
    presencas.forEach(p => {
      presencaMap[p.usuario_nome + (p.email || '')] = p;
    });
    // Adicionar presenca_id e presente em cada inscrição
    const inscricoesComPresenca = inscricoes.map(insc => {
      const key = insc.usuario_nome + (insc.email || '');
      const presenca = presencaMap[key];
      return {
        ...insc,
        presenca_id: presenca ? presenca.presenca_id : null,
        presente: presenca ? presenca.presente : false
      };
    });
    res.render('pages/usuariosInscritos', { 
      pageTitle: 'TickIN - Usuários Inscritos',
      event: evento,
      inscricoes: inscricoesComPresenca,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error);
    res.status(500).render('pages/error', { 
      pageTitle: 'TickIN - Erro',
      message: 'Erro ao carregar inscritos'
    });
  }
});

router.delete('/eventos/:id', async (req, res) => {
  // lógica para deletar evento
  res.json({ message: 'Evento deletado com sucesso!' });
});

// Página de erro 404
router.use((req, res) => {
  res.redirect('/?error=' + encodeURIComponent('A página que você está procurando não existe.'));
});

module.exports = router;
