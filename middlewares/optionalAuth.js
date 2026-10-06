const { verifyToken } = require('../config/jwt');

// Diferente de isAuthenticated (auth.js), este middleware NUNCA bloqueia:
// tenta identificar quem está pedindo e, se não conseguir (sem token, token
// malformado ou expirado), segue como visitante anônimo (req.user fica undefined).
module.exports = function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            req.user = verifyToken(authHeader.split(' ')[1]);
        } catch (err) {
            // Token inválido/expirado: trata como visitante, sem erro.
        }
    }

    next();
};
