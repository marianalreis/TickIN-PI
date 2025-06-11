const express = require('express');
const router = express.Router();
const { checkAuth, checkOrganizador } = require('../middleware/auth');
const usuarioController = require('../controllers/usuarioController');
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const presencaController = require('../controllers/presencaController');
const lembreteController = require('../controllers/lembreteController');
const organizadorController = require('../controllers/organizadorController');
const usuarioRoutes = require('./usuarioRoutes');
const { router: authRouter } = require('./auth');
const Evento = require('../models/eventoModel');

// Rotas de autenticação
router.use('/auth', authRouter);
router.use('/usuarios', usuarioRoutes);

// Rotas de Usuário
router.get('/usuarios/verificar-email/:email', usuarioController.verificarEmail);
router.get('/usuarios/:email', checkAuth, usuarioController.getUsuarioByEmail);
router.put('/usuarios/:email', checkAuth, usuarioController.updateUsuario);
router.delete('/usuarios/:email', checkAuth, usuarioController.deleteUsuario);

// Rota pública para listar eventos
router.get('/eventos/publicos', async (req, res) => {
    try {
        console.log('Recebida requisição para listar eventos públicos:', req.query);
        
        const filtros = {
            termo: req.query.termo,
            status: req.query.status,
            ordem: req.query.ordem
        };

        console.log('Aplicando filtros:', filtros);
        const eventos = await Evento.findAll(filtros);
        console.log(`Retornando ${eventos.length} eventos`);
        
        res.json(eventos);
    } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ erro: err.message || 'Erro ao carregar eventos' });
    }
});

// Rotas de Evento (protegidas)
router.get('/eventos', checkAuth, eventoController.getAllEventos);
router.get('/eventos/:id', checkAuth, eventoController.getEventoById);
router.post('/eventos', checkOrganizador, eventoController.createEvento);
router.put('/eventos/:id', checkOrganizador, eventoController.updateEvento);
router.delete('/eventos/:id', checkOrganizador, eventoController.deleteEvento);
router.get('/eventos/organizador/:organizadorId', checkOrganizador, eventoController.getEventosByOrganizador);

// Rotas de Inscrição
router.post('/inscricoes', checkAuth, inscricaoController.createInscricao);
router.delete('/inscricoes/:id', checkAuth, inscricaoController.cancelarInscricao);
router.get('/inscricoes/minhas', checkAuth, inscricaoController.getMinhasInscricoes);
router.get('/inscricoes/evento/:eventoId', checkAuth, inscricaoController.getInscricoesByEvento);

// Rotas de Presença
router.get('/presencas/evento/:eventoId', checkOrganizador, presencaController.getPresencasByEvento);
router.post('/presencas', checkOrganizador, presencaController.createPresenca);
router.put('/presencas/:id', checkOrganizador, presencaController.updatePresenca);

// Rotas de Lembrete
router.get('/lembretes/usuario/:cpf', checkAuth, lembreteController.getLembretesByUsuario);
router.post('/lembretes', checkAuth, lembreteController.createLembrete);
router.put('/lembretes/:id', checkAuth, lembreteController.updateLembrete);
router.delete('/lembretes/:id', checkAuth, lembreteController.deleteLembrete);

// Rotas de Organizador
router.get('/organizadores', organizadorController.getAllOrganizadores);
router.get('/organizadores/:id', organizadorController.getOrganizadorById);
router.post('/organizadores', checkAuth, organizadorController.createOrganizador);
router.put('/organizadores/:id', checkOrganizador, organizadorController.updateOrganizador);
router.delete('/organizadores/:id', checkOrganizador, organizadorController.deleteOrganizador);

// Middleware de erro global
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;