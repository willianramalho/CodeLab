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

module.exports = { createChallenge, getChallengeDetails, getFeed };
