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

module.exports = { createChallenge };
