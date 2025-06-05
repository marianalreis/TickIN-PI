const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'views/css')));

const app = express();
const port = process.env.PORT || 3000; // Usar variável de ambiente PORT ou 3000 como padrão

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'], // URLs do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(bodyParser.json());

// Servir arquivos estáticos (opcional, para quando tiver arquivos HTML/CSS/JS)
app.use(express.static('public'));

// Usando as rotas definidas
app.use('/api', routes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API funcionando!' });
});

// Rota para verificar status do servidor
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'online', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}/api/test para testar a API`);

  // Exibir rotas do roteador /api
  const apiRouter = routes;
  if (apiRouter.stack) {
    console.log('\nRotas disponíveis:');
    apiRouter.stack.forEach((layer) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ');
        console.log(`Rota registrada: /api${layer.route.path} [${methods}]`);
      }
    });
  }
});
