// Middleware para verificar se o usuário está autenticado
function checkAuth(req, res, next) {
  // Verificar se existe uma sessão de usuário
  const userType = req.session.userType || localStorage.getItem('userType');
  const userId = req.session.userId || localStorage.getItem('userId');
  
  if (!userId) {
    return res.redirect('/login?error=auth_required');
  }
  
  // Continuar para a próxima função
  next();
}

// Middleware para verificar se o usuário é um organizador
function checkOrganizador(req, res, next) {
  const userType = req.session.userType || localStorage.getItem('userType');
  
  if (userType !== 'organizador') {
    return res.redirect('/login?error=unauthorized');
  }
  
  // Continuar para a próxima função
  next();
}

// Middleware para verificar se o usuário é um cliente
function checkCliente(req, res, next) {
  const userType = req.session.userType || localStorage.getItem('userType');
  
  if (userType !== 'cliente') {
    return res.redirect('/login?error=unauthorized');
  }
  
  // Continuar para a próxima função
  next();
}

module.exports = {
  checkAuth,
  checkOrganizador,
  checkCliente
};