const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");

const usuarioController = {
  getAllUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUsuarioByCPF: async (req, res) => {
    try {
      const usuario = await Usuario.findByCPF(req.params.cpf);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.update(req.params.cpf, req.body);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.delete(req.params.cpf);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json({ message: "Usuário removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Método de login - Por enquanto, vamos usar o CPF como senha temporariamente
  // Em produção, você deveria ter um campo senha na tabela usuarios
  loginUsuario: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuário por email
      const usuario = await Usuario.findByEmail(email);

      if (!usuario) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Por enquanto, vamos validar usando o CPF como senha (temporário)
      // Em produção, você deveria ter um hash da senha
      if (password !== usuario.cpf) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Login bem-sucedido - salvar na sessão
      req.session.userId = usuario.cpf;
      req.session.userEmail = usuario.email;
      req.session.userName = usuario.nome;

      res.json({
        message: "Login realizado com sucesso",
        user: {
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Método de logout
  logoutUsuario: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  },
};

module.exports = usuarioController;
