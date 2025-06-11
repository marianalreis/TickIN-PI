const express = require('express');
const router = express.Router();
const Evento = require('../models/eventoModel');
const Inscricao = require('../models/inscricaoModel');

// Middleware para verificar se é organizador
function checkOrganizador(req, res, next) {
    if (!req.session || !req.session.usuario || !req.session.usuario.id) {
        if (req.xhr || req.path.startsWith('/api/')) {
            return res.status(401).json({ erro: 'Usuário não autenticado. Por favor, faça login novamente.' });
        }
        return res.redirect('/login');
    }

    if (req.session.usuario.tipo_usuario !== 'organizador') {
        if (req.xhr || req.path.startsWith('/api/')) {
            return res.status(403).json({ erro: 'Acesso permitido apenas para organizadores' });
        }
        return res.redirect('/');
    }

    req.session.usuario.id = parseInt(req.session.usuario.id, 10);
    next();
}

// Rotas de renderização
router.get('/registrar', checkOrganizador, (req, res) => {
    res.render('registrar', { 
        pageTitle: 'TickIN - Registrar Evento',
        isEditing: false,
        event: null,
        usuario: req.session.usuario
    });
});

router.get('/editar/:id', checkOrganizador, async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.render('error', {
                pageTitle: 'TickIN - Erro',
                message: 'Evento não encontrado'
            });
        }

        if (evento.usuario_id !== req.session.usuario.id) {
            return res.render('error', {
                pageTitle: 'TickIN - Erro',
                message: 'Você não tem permissão para editar este evento'
            });
        }

        res.render('registrar', {
            pageTitle: 'TickIN - Editar Evento',
            isEditing: true,
            event: evento,
            usuario: req.session.usuario
        });
    } catch (err) {
        console.error('Erro ao carregar evento para edição:', err);
        res.render('error', {
            pageTitle: 'TickIN - Erro',
            message: 'Erro ao carregar evento para edição'
        });
    }
});

router.get('/inscritos/:id', checkOrganizador, async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.redirect('/meusEventos?error=' + encodeURIComponent('Evento não encontrado'));
        }

        if (evento.usuario_id !== req.session.usuario.id) {
            return res.redirect('/meusEventos?error=' + encodeURIComponent('Você não tem permissão para ver os inscritos deste evento'));
        }

        const inscricoes = await Inscricao.findByEvento(req.params.id);
        res.render('usuariosInscritos', {
            pageTitle: 'TickIN - Usuários Inscritos',
            evento: evento,
            inscricoes: inscricoes,
            usuario: req.session.usuario
        });
    } catch (err) {
        console.error('Erro ao carregar inscritos:', err);
        res.redirect('/meusEventos?error=' + encodeURIComponent('Erro ao carregar lista de inscritos'));
    }
});

// Rotas da API
router.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        res.status(500).json({ erro: 'Erro ao carregar eventos' });
    }
});

router.get('/eventos/:id', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        res.json(evento);
    } catch (err) {
        console.error('Erro ao carregar detalhes do evento:', err);
        res.status(500).json({ erro: 'Erro ao carregar detalhes do evento' });
    }
});

router.post('/eventos', checkOrganizador, async (req, res) => {
    try {
        if (!req.body.titulo || !req.body.data || !req.body.horario || !req.body.local) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        const dadosEvento = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            data: req.body.data,
            horario: req.body.horario,
            local: req.body.local,
            usuario_id: req.session.usuario.id
        };

        const evento = await Evento.create(dadosEvento);
        res.status(201).json(evento);
    } catch (err) {
        console.error('Erro ao criar evento:', err);
        res.status(500).json({ erro: 'Erro ao criar evento: ' + err.message });
    }
});

router.put('/eventos/:id', checkOrganizador, async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        if (evento.usuario_id !== req.session.usuario.id) {
            return res.status(403).json({ erro: 'Não autorizado' });
        }
        
        const eventoAtualizado = await Evento.update(req.params.id, {
            ...req.body,
            usuario_id: req.session.usuario.id
        });
        res.json(eventoAtualizado);
    } catch (err) {
        console.error('Erro ao atualizar evento:', err);
        res.status(500).json({ erro: 'Erro ao atualizar evento' });
    }
});

router.delete('/eventos/:id', checkOrganizador, async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        if (evento.usuario_id !== req.session.usuario.id) {
            return res.status(403).json({ erro: 'Não autorizado' });
        }
        
        await Evento.delete(req.params.id, req.session.usuario.id);
        res.json({ message: 'Evento deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar evento:', err);
        res.status(500).json({ erro: 'Erro ao deletar evento' });
    }
});

module.exports = router; 