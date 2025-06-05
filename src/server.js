const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const frontRoutes = require('./routes/frontRoutes');
const apiRoutes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração da sessão
app.use(session({
  secret: 'tickin-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies em produção
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para processar requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Para processar dados de formulários

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Rotas de frontend
app.use('/', frontRoutes);

// Rotas de API
app.use('/api', apiRoutes);

// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Página não encontrada'
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port} para ver a aplicação`);
});