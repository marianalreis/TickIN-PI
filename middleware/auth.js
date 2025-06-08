// Middleware para verificar se o usuário está autenticado
function checkAuth(req, res, next) {
  if (!req.session.usuario) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }
  next();
}

// Middleware para verificar se o usuário é um organizador
function checkOrganizador(req, res, next) {
  if (!req.session.usuario) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    return res.redirect('/login');
  }
  if (req.session.usuario.tipo_usuario !== 'organizador') {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(403).json({ erro: 'Acesso permitido apenas para organizadores' });
    }
    return res.redirect('/pesquisar');
  }
  next();
}

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