const challengeService = require('./challengeService');
const { success } = require('../../middlewares/apiResponse');

exports.createChallenge = async (req, res) => {
    const { title, description } = req.body;
    const sourceCodeFilename = req.file.filename;

    const newChallenge = await challengeService.createChallenge(req.user.id, { title, description, sourceCodeFilename });

    return success(res, newChallenge, 'Desafio enviado com sucesso!', 201);
};

exports.getChallenge = async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error('Identificador de desafio inválido.');
        error.status = 400;
        throw error;
    }

    const viewerId = req.user ? req.user.id : undefined;
    const challenge = await challengeService.getChallengeDetails(id, viewerId);

    return success(res, challenge);
};
