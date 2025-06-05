const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Inicializar o app Express antes de usá-lo
const app = express();
const port = process.env.PORT || 3000;

// Configuração do middleware de sessão
app.use(session({
  secret: 'tickin-secret',
  resave: false,
  saveUninitialized: false
}));

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Importante para sessões
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/pages', express.static(path.join(__dirname, 'views/pages')));

// Configurar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas da API
app.use('/api/usuarios', usuarioRoutes);

// Middleware para verificar autenticação
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  req.user = req.session.user;
  next();
};

// Rotas
const eventosRouter = require('./routes/eventos');
const inscricoesRouter = require('./routes/inscricoes');

app.use('/eventos', authMiddleware, eventosRouter);
app.use('/inscricoes', authMiddleware, inscricoesRouter);

// Rota principal
app.get('/', (req, res) => {
  res.render('pages/index');
});

// Rota de login
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Rota de cadastro
app.get('/cadastro', (req, res) => {
  res.render('pages/cadastro');
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const Usuario = require('./models/Usuario');
    const usuario = await Usuario.buscarPorEmail(email);
    
    if (usuario) {
      // Aqui você deve implementar a verificação de senha
      req.session.user = usuario;
      res.redirect('/eventos');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    res.status(500).send('Erro no login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API funcionando!' });
});

// Rota para verificar status do servidor
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'online', timestamp: new Date() });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}/api/test para testar a API`);

  // Exibir rotas do roteador /api
  console.log('\nRotas disponíveis:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
      console.log(`${methods} ${path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(', ');
          console.log(`${methods} /api/usuarios${path}`);
        }
      });
    }
  });
});
