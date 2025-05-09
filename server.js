const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando com Node.js + Express!');
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${3000}`);
});
