const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Rotas públicas
router.post("/register", async (req, res) => {
  try {
    console.log('Corpo da requisição:', req.body);

    const { cpf, nome, email, endereco, telefone, password, userType } = req.body;

    // Log para debug
    console.log('Dados recebidos:', {
      cpf, nome, email, endereco, telefone, 
      temSenha: !!password,
      userType
    });

    // Validações básicas com mensagens específicas
    const camposFaltando = [];
    if (!cpf) camposFaltando.push('CPF');
    if (!nome) camposFaltando.push('Nome');
    if (!email) camposFaltando.push('Email');
    if (!endereco) camposFaltando.push('Endereço');
    if (!telefone) camposFaltando.push('Telefone');
    if (!password) camposFaltando.push('Senha');

    if (camposFaltando.length > 0) {
      console.log('Campos faltando:', camposFaltando);
      return res.status(400).json({ 
        message: `Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}`
      });
    }

    // Validação do CPF (deve ter 11 dígitos após remover caracteres especiais)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Validação do telefone (deve ter entre 10 e 11 dígitos após remover caracteres especiais)
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return res.status(400).json({ message: 'Telefone inválido' });
    }

    const connection = await pool.getConnection();

    try {
      // Verifica se o CPF já existe
      const [existingUser] = await connection.execute(
        'SELECT * FROM usuarios WHERE CPF = ?',
        [cpfLimpo]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }

      // Verifica se o email já existe
      const [existingEmail] = await connection.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere o usuário na tabela usuarios
      await connection.execute(
        'INSERT INTO usuarios (CPF, nome, email, endereco, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)',
        [cpfLimpo, nome, email, endereco, telefoneLimpo, hashedPassword]
      );

      // Se for organizador, insere na tabela organizadores
      if (userType === 'organizador') {
        await connection.execute(
          'INSERT INTO organizadores (CPF, nome) VALUES (?, ?)',
          [cpfLimpo, nome]
        );
      }

      console.log('Usuário cadastrado com sucesso:', {
        cpf: cpfLimpo,
        nome,
        email,
        tipo: userType
      });

      res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const connection = await pool.getConnection();

    try {
      // Busca o usuário pelo email
      const [users] = await connection.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      const user = users[0];

      // Verifica a senha
      const senhaCorreta = await bcrypt.compare(password, user.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      // Verifica se é organizador
      const [organizador] = await connection.execute(
        'SELECT * FROM organizadores WHERE CPF = ?',
        [user.CPF]
      );

      // Cria a sessão do usuário
      req.session.userId = user.CPF;
      req.session.userType = organizador.length > 0 ? 'organizador' : 'cliente';

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          cpf: user.CPF,
          nome: user.nome,
          email: user.email,
          tipo: req.session.userType
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

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

// Rota de logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

module.exports = router;
