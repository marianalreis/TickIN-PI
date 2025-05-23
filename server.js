const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas definidas
app.use('/api', routes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API funcionando!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);

  // Exibir rotas do roteador /api
  const apiRouter = routes;
  if (apiRouter.stack) {
    apiRouter.stack.forEach((layer) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ');
        console.log(`Rota registrada: /api${layer.route.path} [${methods}]`);
      }
    });
  }
});
