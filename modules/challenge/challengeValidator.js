const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { VALIDATION } = require('../../config/constants');

// Cópia local do helper validate() de userValidator.js (lá ele não é
// exportado). Aqui ela ganha um cuidado extra: se a validação falhar depois
// que o Multer já gravou o arquivo em disco, essa cópia apaga o arquivo
// (de forma síncrona, para o teste de arquivo órfão ficar determinístico)
// antes de lançar o erro.
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    if (req.file) {
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            // Se o arquivo já não existir, não há o que fazer.
        }
    }

    const firstError = errors.array()[0].msg;

    const error = new Error(firstError);
    error.status = 400;
    error.errors = errors.array();
    throw error;
};

const titleAndDescriptionRules = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('O título é obrigatório.')
        .isLength({ max: VALIDATION.TITLE_MAX })
        .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: VALIDATION.DESCRIPTION_MAX })
        .withMessage(`A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`)
];

// Na edição o arquivo é opcional: só título/descrição são validados.
exports.updateChallengeValidator = [...titleAndDescriptionRules, validate];

exports.createChallengeValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('O título é obrigatório.')
        .isLength({ max: VALIDATION.TITLE_MAX })
        .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: VALIDATION.DESCRIPTION_MAX })
        .withMessage(`A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`),
    body('sourceCode')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('O arquivo de código-fonte é obrigatório.');
            }
            return true;
        }),
    validate
];
