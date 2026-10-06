const fs = require('fs');
const { error } = require('./apiResponse');

// Arquivos que o Multer já gravou em disco numa requisição que falhou depois
// (validação, 403, 404, erro de banco) nunca chegam a ser referenciados por
// nenhum registro: são órfãos. Apagamos aqui, num ponto só, em vez de em cada rota.
function removeOrphanFiles(req) {
    const files = [];

    if (req.file) files.push(req.file);
    if (Array.isArray(req.files)) {
        files.push(...req.files);
    } else if (req.files) {
        Object.values(req.files).forEach((group) => files.push(...group));
    }

    files.forEach((file) => {
        if (file.path) {
            fs.unlink(file.path, () => {});
        }
    });
}

module.exports = (err, req, res, next) => {
    console.error(err);

    removeOrphanFiles(req);

    const statusCode = err.status || 500;
    const errors = err.errors || [];

    return error(res, err.message || 'Ocorreu um erro inesperado.', statusCode, errors);
};
