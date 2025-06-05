const express = require('express');
const router = express.Router();
const Inscricao = require('../models/Inscricao');

// Listar inscrições do usuário
router.get('/minhas', async (req, res) => {
    try {
        const inscricoes = await Inscricao.buscarPorUsuario(req.user.cpf);
        res.render('pages/minhas-inscricoes', { inscricoes });
    } catch (err) {
        res.status(500).send('Erro ao carregar inscrições');
    }
});

// Criar nova inscrição
router.post('/', async (req, res) => {
    try {
        const inscricao = {
            ...req.body,
            cpf: req.user.cpf,
            data_inscricao: new Date(),
            status: 'pendente'
        };
        await Inscricao.criar(inscricao);
        res.redirect('/inscricoes/minhas');
    } catch (err) {
        res.status(500).send('Erro ao realizar inscrição');
    }
});

// Atualizar status da inscrição
router.put('/:id/status', async (req, res) => {
    try {
        const inscricao = await Inscricao.atualizarStatus(req.params.id, req.body.status);
        res.json(inscricao);
    } catch (err) {
        res.status(500).send('Erro ao atualizar status da inscrição');
    }
});

// Listar inscritos em um evento
router.get('/evento/:id', async (req, res) => {
    try {
        const inscritos = await Inscricao.buscarPorEvento(req.params.id);
        res.render('pages/usuarios-inscritos', { inscritos });
    } catch (err) {
        res.status(500).send('Erro ao carregar lista de inscritos');
    }
});

module.exports = router; 