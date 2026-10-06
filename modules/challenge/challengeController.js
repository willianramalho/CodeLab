const challengeService = require('./challengeService');
const { success } = require('../../middlewares/apiResponse');

exports.createChallenge = async (req, res) => {
    const { title, description } = req.body;
    const sourceCodeFilename = req.file.filename;

    const newChallenge = await challengeService.createChallenge(req.user.id, { title, description, sourceCodeFilename });

    return success(res, newChallenge, 'Desafio enviado com sucesso!', 201);
};

function parseId(req) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error('Identificador de desafio inválido.');
        error.status = 400;
        throw error;
    }

    return id;
}

exports.getChallenge = async (req, res) => {
    const id = parseId(req);

    const viewerId = req.user ? req.user.id : undefined;
    const challenge = await challengeService.getChallengeDetails(id, viewerId);

    return success(res, challenge);
};

exports.getMyChallenges = async (req, res) => {
    const challenges = await challengeService.getMyChallenges(req.user.id);

    return success(res, challenges);
};

exports.getChallengeForEdit = async (req, res) => {
    const challenge = await challengeService.getChallengeForEdit(parseId(req), req.user.id);

    return success(res, challenge);
};

exports.updateChallenge = async (req, res) => {
    const { title, description } = req.body;
    const newFilename = req.file ? req.file.filename : undefined;

    const challenge = await challengeService.updateChallenge(parseId(req), req.user.id, { title, description, newFilename });

    return success(res, challenge, 'Desafio atualizado com sucesso!');
};

exports.deleteChallenge = async (req, res) => {
    await challengeService.deleteChallenge(parseId(req), req.user.id);

    return success(res, null, 'Desafio excluído com sucesso.');
};
