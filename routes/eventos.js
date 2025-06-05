const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');
const Inscricao = require('../models/Inscricao');

// Listar todos os eventos
router.get('/', async (req, res) => {
    try {
        const eventos = await Evento.listarTodos();
        res.render('pages/eventos', { eventos });
    } catch (err) {
        res.status(500).send('Erro ao carregar eventos');
    }
});

// Página de detalhes do evento
router.get('/:id', async (req, res) => {
    try {
        const evento = await Evento.buscarPorId(req.params.id);
        const inscritos = await Inscricao.buscarPorEvento(req.params.id);
        res.render('pages/evento-detalhes', { evento, inscritos });
    } catch (err) {
        res.status(500).send('Erro ao carregar detalhes do evento');
    }
});

// Criar novo evento
router.post('/', async (req, res) => {
    try {
        const evento = await Evento.criar(req.body);
        res.redirect(`/eventos/${evento.evento_ID}`);
    } catch (err) {
        res.status(500).send('Erro ao criar evento');
    }
});

// Atualizar evento
router.put('/:id', async (req, res) => {
    try {
        const evento = await Evento.atualizar(req.params.id, req.body);
        res.json(evento);
    } catch (err) {
        res.status(500).send('Erro ao atualizar evento');
    }
});

module.exports = router; 