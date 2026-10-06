const challengeService = require('./challengeService');
const { success } = require('../../middlewares/apiResponse');

exports.createChallenge = async (req, res) => {
    const { title, description } = req.body;
    const sourceCodeFilename = req.file.filename;

    const newChallenge = await challengeService.createChallenge(req.user.id, { title, description, sourceCodeFilename });

    return success(res, newChallenge, 'Desafio enviado com sucesso!', 201);
};
