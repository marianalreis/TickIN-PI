const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // permite receber dados no formato JSON

const routes = require('./routesn/index');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
