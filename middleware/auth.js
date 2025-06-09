const pool = require('../config/database');

// Middleware para verificar se o usuário está autenticado
function checkAuth(req, res, next) {
  if (!req.session.usuario) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Se for AJAX/API, retorna erro JSON
      return res.status(401).json({ message: 'Não autenticado' });
    }
    // Se for navegação normal, redireciona
    return res.redirect('/meusEventos');
  }
  next();
}

// Middleware para verificar se o usuário é um organizador
const checkOrganizador = async (req, res, next) => {
  const isAjax = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);

  if (!req.session?.usuario?.id) {
    if (isAjax) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }

  try {
    const query = "SELECT * FROM usuarios WHERE id = $1 AND tipo_usuario = 'organizador'";
    const { rows } = await pool.query(query, [req.session.usuario.id]);
    const usuario = rows[0];

    if (!usuario) {
      if (isAjax) {
        return res.status(403).json({ erro: 'Acesso permitido apenas para organizadores' });
      }
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
    console.error('Erro na verificação de organizador:', error);
    if (isAjax) {
      return res.status(500).json({ erro: 'Erro ao verificar permissões' });
    }
    res.redirect('/login');
  }
};

// Middleware para verificar se o usuário é um cliente
function checkCliente(req, res, next) {
  if (!req.session.usuario) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }
  if (req.session.usuario.tipo_usuario !== 'cliente') {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(403).json({ erro: 'Acesso permitido apenas para clientes' });
    }
    return res.redirect('/meusEventos');
  }
  next();
}

module.exports = {
  checkAuth,
  checkOrganizador,
  checkCliente
};