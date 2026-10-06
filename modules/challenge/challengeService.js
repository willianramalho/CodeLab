const fs = require('fs');
const path = require('path');
const Challenge = require('./challengeModel');
const User = require('../user/userModel');
const sequelize = require('../../config/database');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'challenges');

async function createChallenge(userId, { title, description, sourceCodeFilename }) {
    try {
        const challenge = await sequelize.transaction(async (t) => {
            const newChallenge = await Challenge.create({
                title,
                description: description || null,
                sourceCode: sourceCodeFilename,
                userId
            }, { transaction: t });

            await User.increment('challengesCount', { by: 1, where: { id: userId }, transaction: t });

            return newChallenge;
        });

        return {
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            sourceCode: challenge.sourceCode,
            userId: challenge.userId,
            createdAt: challenge.createdAt
        };
    } catch (err) {
        // Se a transação falhar, o arquivo já gravado em disco é descartado.
        await fs.promises.unlink(path.join(UPLOADS_DIR, sourceCodeFilename)).catch(() => {});
        throw err;
    }
}

const AUTHOR_ATTRIBUTES = ['id', 'username', 'fullName', 'profilePicture'];

function serializeChallenge(challenge) {
    return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        sourceCode: challenge.sourceCode,
        viewsCount: challenge.viewsCount,
        userId: challenge.userId,
        createdAt: challenge.createdAt,
        author: challenge.author
    };
}

// viewerId vem de optionalAuth: undefined para visitantes anônimos.
async function getChallengeDetails(id, viewerId) {
    const challenge = await Challenge.findByPk(id, {
        include: [{ model: User, as: 'author', attributes: AUTHOR_ATTRIBUTES }]
    });

    if (!challenge) {
        const error = new Error('Desafio não encontrado.');
        error.status = 404;
        throw error;
    }

    await challenge.increment('viewsCount', { by: 1 });
    await challenge.reload();

    return {
        ...serializeChallenge(challenge),
        isOwner: viewerId !== undefined && viewerId === challenge.userId
    };
}

// offset = (page - 1) * limit: converte "página" (cliente) em "quantos pular" (banco).
// Busca limit + 1 registros só para saber se existe próxima página.
async function getFeed(page, limit) {
    const offset = (page - 1) * limit;

    const rows = await Challenge.findAll({
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit: limit + 1,
        offset,
        include: [{ model: User, as: 'author', attributes: AUTHOR_ATTRIBUTES }]
    });

    return {
        items: rows.slice(0, limit).map(serializeChallenge),
        page,
        limit,
        hasMore: rows.length > limit
    };
}

// "Existe?" (404) sempre antes de "é seu?" (403): quem não é dono não deve
// conseguir descobrir, pelo status, se um id inexistente poderia ser dele.
async function findOwned(id, userId) {
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
        const error = new Error('Desafio não encontrado.');
        error.status = 404;
        throw error;
    }

    if (challenge.userId !== userId) {
        const error = new Error('Você não tem permissão para alterar este desafio.');
        error.status = 403;
        throw error;
    }

    return challenge;
}

function removeFile(filename) {
    return fs.promises.unlink(path.join(UPLOADS_DIR, filename)).catch(() => {});
}

async function getMyChallenges(userId) {
    const challenges = await Challenge.findAll({
        where: { userId },
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
    });

    return challenges.map(serializeChallenge);
}

async function getChallengeForEdit(id, userId) {
    const challenge = await findOwned(id, userId);
    return serializeChallenge(challenge);
}

async function updateChallenge(id, userId, { title, description, newFilename }) {
    const challenge = await findOwned(id, userId);
    const oldFilename = challenge.sourceCode;

    challenge.title = title;
    challenge.description = description || null;
    if (newFilename) {
        challenge.sourceCode = newFilename;
    }

    // Banco primeiro, disco depois: se o save falhar, o arquivo antigo continua
    // intacto e o registro válido. Na ordem inversa, um save falho deixaria o
    // registro apontando para um arquivo que já não existe.
    await challenge.save();

    if (newFilename) {
        await removeFile(oldFilename);
    }

    return serializeChallenge(challenge);
}

async function deleteChallenge(id, userId) {
    const challenge = await findOwned(id, userId);
    const filename = challenge.sourceCode;

    await sequelize.transaction(async (t) => {
        await challenge.destroy({ transaction: t });
        await User.decrement('challengesCount', { by: 1, where: { id: userId }, transaction: t });
    });

    await removeFile(filename);
}

module.exports = {
    createChallenge, getChallengeDetails, getFeed,
    getMyChallenges, getChallengeForEdit, updateChallenge, deleteChallenge
};
