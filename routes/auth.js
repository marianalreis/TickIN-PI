const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcrypt');

// Middleware de autenticação
const checkAuth = async (req, res, next) => {
  if (!req.session?.usuario?.id) {
    return res.redirect('/login');
  }

  try {
    // Buscar usuário no banco
    const query = "SELECT * FROM usuarios WHERE id = $1";
    const { rows } = await pool.query(query, [req.session.usuario.id]);
    const usuario = rows[0];

    if (!usuario) {
      return res.redirect('/login');
    }

    req.session.usuario = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    };
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.redirect('/login');
  }
};

// Middleware de verificação de organizador
const checkOrganizador = async (req, res, next) => {
  if (!req.session?.usuario?.id) {
    if (req.path.startsWith('/api/') || req.xhr) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }

  try {
    // Buscar usuário no banco
    const query = "SELECT * FROM usuarios WHERE id = $1 AND tipo_usuario = 'organizador'";
    const { rows } = await pool.query(query, [req.session.usuario.id]);
    const usuario = rows[0];

    if (!usuario) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json({ erro: 'Acesso permitido apenas para organizadores' });
      }
      return res.redirect('/pesquisar');
    }

    req.session.usuario = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    };
    
    next();
  } catch (error) {
    console.error('Erro na verificação de organizador:', error);
    if (req.path.startsWith('/api/') || req.xhr) {
      return res.status(500).json({ erro: 'Erro ao verificar permissões' });
    }
    res.redirect('/login');
  }
};

// Middleware de verificação de cliente
const checkCliente = (req, res, next) => {
  console.log('Session in checkCliente:', req.session);
  if (!req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }

  if (req.session.usuario.tipo_usuario !== 'cliente') {
    return res.redirect('/meusEventos');
  }

  next();
};

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Buscar usuário pelo email
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas'
      });
    }

    // Salvar dados na sessão
    req.session.usuario = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario
    };

    // Salvar a sessão
    req.session.save((err) => {
      if (err) {
        console.error('Erro ao salvar sessão:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao fazer login'
        });
      }

      // Redirecionar baseado no tipo de usuário
      const redirecionamento = usuario.tipo_usuario === 'organizador' ? '/meusEventos' : '/pesquisar';
      res.json({ 
        success: true, 
        redirect: redirecionamento,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          tipo_usuario: usuario.tipo_usuario
        }
      });
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao fazer login. Por favor, tente novamente.'
    });
  }
});

// Rota de logout
router.post('/logout', (req, res) => {
  try {
    req.session.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao fazer logout'
    });
  }
});

module.exports = {
  router,
  checkAuth,
  checkOrganizador,
  checkCliente
};