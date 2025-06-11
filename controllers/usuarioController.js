const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

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
      const usuario = await Usuario.buscarPorEmail(req.params.email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: error.message });
    }
  },

  verificarEmail: async (req, res) => {
    try {
      const usuario = await Usuario.buscarPorEmail(req.params.email);
      res.json({ exists: !!usuario });
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      res.status(500).json({ message: error.message });
    }
  },

  createUsuario: async (req, res) => {
    try {
      console.log('Dados recebidos:', req.body);
      
      // Validação básica
      if (!req.body.nome || !req.body.email || !req.body.senha || !req.body.tipo_usuario || !req.body.cpf) {
        return res.status(400).json({ 
          message: "Dados incompletos. Nome, CPF, email, senha e tipo de usuário são obrigatórios." 
        });
      }

      // Verificar se o email já existe
      const existingUser = await Usuario.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Verificar se o CPF já existe
      const existingCPF = await Usuario.findByCPF(req.body.cpf);
      if (existingCPF) {
        return res.status(400).json({ message: "CPF já cadastrado" });
      }

      const usuario = await Usuario.create({
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone || '',
        senha: req.body.senha,
        tipo_usuario: req.body.tipo_usuario
      });

      // Iniciar sessão após o cadastro
      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      };
      
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
      const { email, senha } = req.body;

      // Validação básica
      if (!email || !senha) {
        return res.status(400).json({ 
          success: false, 
          message: "Email e senha são obrigatórios"
        });
      }

      // Buscar usuário por email
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ 
          success: false, 
          message: "Email ou senha incorretos"
        });
      }

      // Validar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ 
          success: false, 
          message: "Email ou senha incorretos"
        });
      }

      // Login bem-sucedido - salvar na sessão
      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      };

      // Redirecionar baseado no tipo de usuário
      const redirecionamento = usuario.tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar';
      res.json({
        success: true, 
        redirect: redirecionamento 
      });

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro ao fazer login. Por favor, tente novamente."
      });
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
