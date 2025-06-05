const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const Usuario = require('../models/Usuario');

// Rotas públicas
router.post("/register", usuarioController.createUsuario);
router.post("/login", usuarioController.loginUsuario);

// Rotas protegidas (requerem autenticação)
router.use(require('../middleware/auth')); // Middleware de autenticação

router.get("/", usuarioController.getAllUsuarios);
router.get("/:email", usuarioController.getUsuarioByEmail);
router.put("/:email", usuarioController.updateUsuario);
router.delete("/:email", usuarioController.deleteUsuario);
router.post("/logout", usuarioController.logoutUsuario);

// Rota para criar novo usuário
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, telefone, email } = req.body;
        
        // Gera um CPF temporário (você deve implementar uma validação adequada)
        const cpf = telefone.replace(/\D/g, ''); // Usando o telefone como CPF temporário
        
        const novoUsuario = {
            cpf,
            nome,
            email,
            telefone,
            endereco: '' // Campo opcional por enquanto
        };

        const usuarioCriado = await Usuario.criar(novoUsuario);
        
        if (usuarioCriado) {
            // Inicia a sessão do usuário após o cadastro
            req.session.user = usuarioCriado;
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                redirect: '/eventos'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Erro ao criar usuário'
            });
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao criar usuário'
        });
    }
});

// Rota para verificar se email já existe
router.get('/verificar-email/:email', async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorEmail(req.params.email);
        res.json({ exists: !!usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar email' });
    }
});

module.exports = router;
