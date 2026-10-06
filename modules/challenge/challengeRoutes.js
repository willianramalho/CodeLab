const express = require('express');
const router = express.Router();
const multer = require('multer');
const challengeController = require('./challengeController');
const { createChallengeValidator, updateChallengeValidator } = require('./challengeValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const isAuthenticated = require('../../middlewares/auth');
const optionalAuth = require('../../middlewares/optionalAuth');
const challengeMulter = require('../../middlewares/challengeMulter');
const { UPLOAD } = require('../../config/constants');

// Envolve o multer.single('sourceCode') para transformar os erros dele em
// 400 com mensagem em português, em vez de deixar o errorHandler devolver
// um 500 com a mensagem nativa em inglês (ver D4 — diferente do wrapper da
// Aula 05, que marca QUALQUER erro como 400, inclusive falha de disco).
function uploadChallengeFile(req, res, next) {
    challengeMulter.single('sourceCode')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                err.message = `O arquivo deve ter no máximo ${UPLOAD.CHALLENGE_MAX_SIZE / (1024 * 1024)}MB.`;
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                err.message = 'Campo de arquivo inesperado. Envie o código-fonte no campo "sourceCode".';
            }
            err.status = 400;
            return next(err);
        }

        if (err) {
            // Erro do fileFilter (extensão inválida) já nasce com status 400.
            return next(err);
        }

        next();
    });
}

router.post('/challenges', isAuthenticated, uploadChallengeFile, createChallengeValidator, asyncHandler(challengeController.createChallenge));
router.get('/my-challenges', isAuthenticated, asyncHandler(challengeController.getMyChallenges));
router.get('/challenges/:id/edit', isAuthenticated, asyncHandler(challengeController.getChallengeForEdit));
router.put('/challenges/:id', isAuthenticated, uploadChallengeFile, updateChallengeValidator, asyncHandler(challengeController.updateChallenge));
router.delete('/challenges/:id', isAuthenticated, asyncHandler(challengeController.deleteChallenge));
router.get('/challenges/:id', optionalAuth, asyncHandler(challengeController.getChallenge));

module.exports = router;
