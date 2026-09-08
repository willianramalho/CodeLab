const { verifyToken } = require('../config/jwt');

module.exports = function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error('Token de autenticação não informado.');
        error.status = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        const error = new Error('Token inválido ou expirado.');
        error.status = 401;
        throw error;
    }
};
