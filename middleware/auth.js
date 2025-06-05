const auth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Não autorizado. Faça login para continuar.' });
    }
    next();
};

module.exports = auth; 