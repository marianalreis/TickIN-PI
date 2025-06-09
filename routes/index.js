const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador, checkCliente } = require('../middleware/auth');

// Rota principal - redirecionar para login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Rotas de autenticação
router.get('/login', (req, res) => {
  res.render('pages/login', { pageTitle: 'TickIN - Login' });
});

router.get('/cadastro', (req, res) => {
  res.render('pages/cadastro', { pageTitle: 'TickIN - Cadastro' });
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

// Rotas de pesquisa e eventos
router.get('/pesquisar', (req, res) => {
  res.render('pages/pesquisar', { pageTitle: 'TickIN - Pesquisar Eventos' });
});

router.get('/evento/:id', async (req, res) => {
  // Simulação de dados do evento
  const evento = {
    id: req.params.id,
    title: 'Evento de Exemplo',
    description: 'Descrição detalhada do evento...',
    date: '31/12/2023',
    time: '19:00',
    location: 'São Paulo, SP',
    price: 50.00,
    image: '/assets/event1.jpg',
    organizer: {
      name: 'Organizador Demo',
      description: 'Organizador de eventos',
      image: '/assets/organizer1.jpg'
    }
  };
  
  res.render('pages/detalhes', { 
    pageTitle: `TickIN - ${evento.title}`,
    event: evento
  });
});

// Rotas de organizador
router.get('/meusEventos', checkOrganizador, async (req, res) => {
  // Simulação de eventos do organizador
  const events = [
    {
      id: '101',
      title: 'Evento de Música',
      date: '31/12/2023',
      time: '19:00',
      location: 'São Paulo, SP',
      price: 50.00,
      image: '/assets/event1.jpg'
    }
  ];
  
  res.render('pages/meusEventos', { 
    pageTitle: 'TickIN - Meus Eventos',
    events: events
  });
});

router.get('/registrar', checkOrganizador, (req, res) => {
  res.render('pages/registrar', { 
    pageTitle: 'TickIN - Registrar Evento',
    isEditing: false
  });
});

router.get('/editar-evento/:id', checkOrganizador, async (req, res) => {
  // Simulação de dados do evento
  const event = {
    id: req.params.id,
    title: 'Evento de Exemplo',
    description: 'Descrição do evento',
    date: '2023-12-31',
    time: '19:00',
    location: 'São Paulo, SP',
    price: 50.00
  };
  
  res.render('pages/registrar', { 
    pageTitle: 'TickIN - Editar Evento',
    isEditing: true,
    event: event
  });
});

router.get('/usuarios-inscritos/:id', checkOrganizador, async (req, res) => {
  // Simulação de dados do evento
  const event = {
    id: req.params.id,
    title: 'Evento de Exemplo',
    date: '31/12/2023',
    time: '19:00',
    location: 'São Paulo, SP',
    image: '/assets/event1.jpg'
  };
  
  // Simulação de inscrições
  const registrations = [
    {
      id: '1',
      status: 'Confirmado',
      createdAt: '2023-11-15',
      presente: false,
      user: {
        name: 'Cliente Demo',
        email: 'cliente@exemplo.com',
        avatar: '/assets/user1.jpg'
      }
    }
  ];
  
  res.render('pages/usuariosInscritos', { 
    pageTitle: 'TickIN - Usuários Inscritos',
    event: event,
    registrations: registrations
  });
});

// Rotas de cliente
router.get('/minhas-inscricoes', checkAuth, async (req, res) => {
  // Simulação de inscrições do cliente
  const registrations = [
    {
      id: '1',
      status: 'Confirmado',
      event: {
        id: '101',
        title: 'Evento de Exemplo',
        date: '31/12/2023',
        time: '19:00',
        location: 'São Paulo, SP',
        image: '/assets/event1.jpg'
      }
    }
  ];
  
  res.render('pages/minhasInscricoes', { 
    pageTitle: 'TickIN - Minhas Inscrições',
    registrations: registrations
  });
});

// API de eventos
router.get('/api/eventos', (req, res) => {
  const searchTerm = req.query.search || '';
  
  // Simulação de eventos
  const eventos = [
    {
      id: '101',
      title: 'Evento de Música',
      date: '2023-12-31',
      time: '19:00',
      location: 'São Paulo, SP',
      price: 50.00,
      image: '/assets/event1.jpg',
      organizer: {
        name: 'Organizador Demo',
        image: '/assets/organizer1.jpg'
      }
    },
    {
      id: '102',
      title: 'Workshop de Tecnologia',
      date: '2023-11-15',
      time: '14:00',
      location: 'Rio de Janeiro, RJ',
      price: 30.00,
      image: '/assets/event2.jpg',
      organizer: {
        name: 'Organizador Demo',
        image: '/assets/organizer1.jpg'
      }
    }
  ];
  
  // Filtrar por termo de busca
  const filteredEvents = searchTerm 
    ? eventos.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : eventos;
  
  res.json(filteredEvents);
});

// API de inscrições
router.post('/api/inscricoes', checkAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Inscrição realizada com sucesso',
    redirect: '/minhas-inscricoes'
  });
});

// API de presença
router.post('/api/presencas', checkOrganizador, (req, res) => {
  const { inscricaoId, presente } = req.body;
  
  res.json({
    success: true,
    message: `Presença ${presente ? 'confirmada' : 'removida'} com sucesso`,
    inscricaoId,
    presente
  });
});

// API de lembretes
router.post('/api/lembretes/enviar', checkOrganizador, (req, res) => {
  const { usuarios, mensagem } = req.body;
  
  res.json({
    success: true,
    message: `Lembrete enviado com sucesso para ${usuarios.length} usuário(s)`,
    enviados: usuarios
  });
});

module.exports = router;
