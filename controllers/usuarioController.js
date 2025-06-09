const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");

const usuarioController = {
  getAllUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getUsuarioByEmail: async (req, res) => {
    try {
      const usuario = await Usuario.findByEmail(req.params.email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: error.message });
    }
  },

  createUsuario: async (req, res) => {
    try {
      console.log('Dados recebidos:', req.body);
      
      // Validação básica
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.userType) {
        return res.status(400).json({ 
          message: "Dados incompletos. Nome, email, senha e tipo de usuário são obrigatórios." 
        });
      }

      // Verificar se o email já existe
      const existingUser = await Usuario.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const usuario = await Usuario.create({
        nome: req.body.name,
        email: req.body.email,
        telefone: req.body.phone || '',
        senha: req.body.password,
        tipo_usuario: req.body.userType
      });

      // Iniciar sessão após o cadastro
      req.session.userId = usuario.id;
      req.session.userEmail = usuario.email;
      req.session.userName = usuario.nome;
      req.session.userType = usuario.tipo_usuario;
      
      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: usuario
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: "Erro ao criar usuário: " + error.message });
    }
  },

  updateUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.update(req.params.email, req.body);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.delete(req.params.email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json({ message: "Usuário removido com sucesso" });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: error.message });
    }
  },

  loginUsuario: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuário por email
      const usuario = await Usuario.findByEmail(email);

      if (!usuario) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Validar senha
      const senhaValida = await Usuario.validatePassword(password, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Login bem-sucedido - salvar na sessão
      req.session.userId = usuario.id;
      req.session.userEmail = usuario.email;
      req.session.userName = usuario.nome;
      req.session.userType = usuario.tipo_usuario;

      // Remove a senha do objeto retornado
      delete usuario.senha;

      res.json({
        message: "Login realizado com sucesso",
        user: usuario
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: error.message });
    }
  },

  logoutUsuario: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  },
};

module.exports = usuarioController;
