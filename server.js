// Importações necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const usuarioRoutes = require('./routes/usuarioRoutes');
const { router: authRouter, checkAuth, checkOrganizador } = require('./routes/auth');
const indexRoutes = require('./routes/index');
const eventosRoutes = require('./routes/eventosRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const apiRoutes = require('./routes/api');
const Evento = require('./models/eventoModel');
const pool = require('./config/database');
const presencaRoutes = require('./routes/presencaRoutes');

// Inicializar o app Express
const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configurar arquivos estáticos
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'views/images')));

// Configurar view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    httpOnly: true,
    sameSite: 'lax'
  },
  name: 'tickin_session'
}));

// Middleware para debug de sessão
app.use((req, res, next) => {
  console.log('Session middleware - session:', {
    id: req.session.id,
    usuario: req.session.usuario,
    cookie: req.session.cookie
  });
  next();
});

// Middleware para variáveis globais
app.use((req, res, next) => {
  if (req.session.usuario) {
    res.locals.usuario = req.session.usuario;
    res.locals.isAuthenticated = true;
  } else {
    res.locals.usuario = null;
    res.locals.isAuthenticated = false;
  }
    next();
});

// Testar conexão com o banco de dados
pool.connect((err, client, done) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    done();
  }
});

// Configurar rotas da API
app.use('/api', apiRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/presenca', presencaRoutes);

// Configurar rotas de páginas
app.use('/', indexRoutes);
app.use('/eventos', eventosRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});