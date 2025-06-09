const express = require('express');
const app = express();
const port = 3000;

// Configurações básicas
app.use(express.json());
app.use(express.static('public'));

// Configurar EJS
app.set('view engine', 'ejs');

// Rotas básicas
app.get('/', (req, res) => {
  res.send('Página inicial');
});

app.get('/login', (req, res) => {
  res.send('Página de login');
});

// API Routes
app.post('/api/usuarios/login', (req, res) => {
  res.json({ 
    message: 'Login realizado com sucesso',
    redirect: '/pesquisar'
  });
});

app.post('/api/inscricoes', (req, res) => {
  res.json({
    success: true,
    message: 'Inscrição realizada com sucesso'
  });
});

app.put('/api/inscricoes/:id/cancelar', (req, res) => {
  res.json({
    success: true,
    message: 'Inscrição cancelada com sucesso'
  });
});

app.post('/api/lembretes', (req, res) => {
  res.json({
    success: true,
    message: 'Lembrete enviado com sucesso'
  });
});

app.delete('/api/presencas/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Presença removida com sucesso'
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});