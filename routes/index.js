var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse');

// Rota raiz da API - útil para verificar rapidamente se o servidor está no ar.
router.get('/', (req, res) => {
    return success(res, {
        name: 'CodeLab API',
        version: '1.0.0',
        status: 'online'
    }, 'Bem-vindo à API do CodeLab.');
});

module.exports = router;