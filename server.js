// Importações necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

// Inicializar o app Express
const app = express();
const port = process.env.PORT || 3000;

// Configurações básicas
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configurar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração para servir arquivos estáticos - SIMPLIFICADA
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Configuração de sessão
app.use(session({
  secret: 'tickin-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware para variáveis globais
app.use((req, res, next) => {
  res.locals.userType = req.session.userType || 'cliente';
  res.locals.userName = req.session.userName || 'Usuário';
  res.locals.userEmail = req.session.userEmail || 'usuario@email.com';
  next();
});

// Middleware de autenticação
function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

function checkOrganizador(req, res, next) {
  if (req.session.userType === 'organizador') {
    next();
  } else {
    res.redirect('/login?error=unauthorized');
  }
}

// ROTAS PRINCIPAIS
app.get('/', (req, res) => {
  res.render('pages/home', { pageTitle: 'TickIN - Início' });
});

app.get('/login', (req, res) => {
  res.render('pages/login', { pageTitle: 'TickIN - Login' });
});

app.get('/cadastro', (req, res) => {
  res.render('pages/cadastro', { pageTitle: 'TickIN - Cadastro' });
});

app.get('/pesquisar', (req, res) => {
  res.render('pages/pesquisar', { pageTitle: 'TickIN - Pesquisar Eventos' });
});

app.get('/evento/:id', (req, res) => {
  // Dados simulados do evento
  const event = {
    id: req.params.id,
    title: 'Workshop de Programação',
    description: 'Aprenda a programar em JavaScript do zero.',
    date: '15/12/2023',
    time: '19:00',
    location: 'Online',
    price: 50.00,
    image: '/assets/event1.jpg',
    organizer: {
      name: 'Tech Academy',
      description: 'Escola de programação especializada em cursos online.',
      image: '/assets/organizer1.jpg'
    }
  };
  
  res.render('pages/detalhes', { event, pageTitle: `TickIN - ${event.title}` });
});

// ROTAS DE CLIENTE
app.get('/minhas-inscricoes', checkAuth, (req, res) => {
  const registrations = [
    {
      id: 1,
      status: 'Confirmado',
      event: {
        id: 1,
        title: 'Workshop de Programação',
        date: '15/12/2023',
        time: '19:00',
        location: 'Online',
        image: '/assets/event1.jpg'
      }
    },
    {
      id: 2,
      status: 'Pendente',
      event: {
        id: 2,
        title: 'Conferência de Tecnologia',
        date: '20/01/2024',
        time: '09:00',
        location: 'Centro de Convenções',
        image: '/assets/event2.jpg'
      }
    }
  ];
  
  res.render('pages/minhasInscricoes', { registrations, pageTitle: 'TickIN - Minhas Inscrições' });
});

// ROTAS DE ORGANIZADOR
app.get('/meusEventos', checkOrganizador, (req, res) => {
  const events = [
    {
      id: 1,
      title: 'Workshop de Programação',
      description: 'Aprenda a programar em JavaScript do zero.',
      date: '15/12/2023',
      time: '19:00',
      location: 'Online',
      valor: 50.00,
      image: '/assets/event1.jpg'
    },
    {
      id: 2,
      title: 'Conferência de Tecnologia',
      description: 'Descubra as últimas tendências em tecnologia.',
      date: '20/01/2024',
      time: '09:00',
      location: 'Centro de Convenções',
      valor: 100.00,
      image: '/assets/event2.jpg'
    }
  ];
  
  res.render('pages/meusEventos', { events, pageTitle: 'TickIN - Meus Eventos' });
});

app.get('/registrar', checkOrganizador, (req, res) => {
  res.render('pages/registrar', { isEditing: false, pageTitle: 'TickIN - Registrar Evento' });
});

app.get('/editar-evento/:id', checkOrganizador, (req, res) => {
  const event = {
    id: req.params.id,
    title: 'Workshop de Programação',
    description: 'Aprenda a programar em JavaScript do zero.',
    date: '2023-12-15',
    time: '19:00',
    location: 'Online',
    price: 50.00
  };
  
  res.render('pages/registrar', { isEditing: true, event, pageTitle: 'TickIN - Editar Evento' });
});

app.get('/usuarios-inscritos/:id', checkOrganizador, (req, res) => {
  const eventoId = req.params.id;
  
  const event = {
    id: eventoId,
    title: 'Workshop de Programação',
    date: '15/12/2023',
    time: '19:00',
    location: 'Online',
    image: '/assets/event1.jpg'
  };
  
  const registrations = [
    {
      id: 1,
      status: 'Confirmado',
      createdAt: '2023-11-01',
      presente: true,
      user: {
        name: 'João Silva',
        email: 'joao@email.com',
        avatar: '/assets/user1.jpg'
      }
    },
    {
      id: 2,
      status: 'Pendente',
      createdAt: '2023-11-05',
      presente: false,
      user: {
        name: 'Maria Souza',
        email: 'maria@email.com',
        avatar: '/assets/user2.jpg'
      }
    }
  ];
  
  res.render('pages/usuariosInscritos', { event, registrations, pageTitle: 'TickIN - Usuários Inscritos' });
});

// API ROUTES
app.post('/api/usuarios/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulação de verificação
  const isOrganizador = email.includes('org');
  
  // Configurar sessão
  req.session.userId = '12345';
  req.session.userEmail = email;
  req.session.userName = isOrganizador ? 'Organizador Teste' : 'Cliente Teste';
  req.session.userType = isOrganizador ? 'organizador' : 'cliente';
  
  const redirect = isOrganizador ? '/meusEventos' : '/pesquisar';
  
  res.json({ 
    message: 'Login realizado com sucesso',
    redirect: redirect,
    user: {
      nome: req.session.userName,
      email: email,
      tipo: req.session.userType
    }
  });
});

// Rota para processar o formulário de evento
app.post('/api/eventos', (req, res) => {
  res.json({
    success: true,
    message: 'Evento criado com sucesso',
    redirect: '/meusEventos'
  });
});

// Rota para atualizar evento
app.put('/api/eventos/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Evento atualizado com sucesso',
    redirect: '/meusEventos'
  });
});

// Rota para processar inscrição em evento
app.post('/api/inscricoes', (req, res) => {
  res.json({
    success: true,
    message: 'Inscrição realizada com sucesso',
    redirect: '/minhas-inscricoes'
  });
});

// Rota para cancelar inscrição
app.put('/api/inscricoes/:id/cancelar', (req, res) => {
  res.json({
    success: true,
    message: 'Inscrição cancelada com sucesso'
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Página não encontrada'
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});