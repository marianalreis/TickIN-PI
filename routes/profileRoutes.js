const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');

// Rota para exibir o perfil
router.get('/', checkAuth, async (req, res) => {
    try {
        // Aqui você pode adicionar lógica para buscar estatísticas do usuário
        const usuario = req.session.usuario;
        
        res.render('pages/profile', {
            usuario: usuario,
            eventosOrganizados: 0, // Você pode buscar isso do banco de dados
            eventosParticipados: 0 // Você pode buscar isso do banco de dados
        });
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        res.status(500).render('error', { message: 'Erro ao carregar perfil' });
    }
});

// Rota de logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.json({ success: true });
    });
});

module.exports = router; 