const validationMiddleware = {
  validateEvento: (req, res, next) => {
    const { titulo, data, hora, local } = req.body;
    
    if (!titulo || !data || !hora || !local) {
      return res.status(400).json({ 
        message: 'Dados incompletos. Título, data, hora e local são obrigatórios.' 
      });
    }
    
    // Validações adicionais aqui
    
    next();
  },
  
  validateUsuario: (req, res, next) => {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ 
        message: 'Dados incompletos. Nome e email são obrigatórios.' 
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido.' });
    }
    
    next();
  }
};

module.exports = validationMiddleware;