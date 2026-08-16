/**
 * Padrão único de resposta da API, usado em todos os controllers.
 *
 * Sucesso:
 *  { "success": true, "data": ..., "message": "..." }
 *
 * Erro:
 *  { "success": false, "message": "...", "errors": [...] }
 */

function success(res, data = null, message = null, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

function error(res, message = 'Ocorreu um erro inesperado.', statusCode = 500, errors = []) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
}

module.exports = { success, error };