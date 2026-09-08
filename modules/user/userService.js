const User = require('./userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../../config/jwt');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'profiles');
const DEFAULT_PROFILE_PICTURE = 'default-profile.png';

async function registerUser(username, email, password, fullName) {
    const emailExists = await User.findOne({ where: { email } });
    const usernameExists = await User.findOne({ where: { username } });
    if (emailExists || usernameExists) {
        throw new Error('Este e-mail ou usuário já está cadastrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName
    });

    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
    };
}

async function loginUser(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const token = generateToken({ id: user.id, username: user.username });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin
        }
    };
}

async function getUserProfile(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'challengesCount', 'isAdmin']
    });

    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.status = 404;
        throw error;
    }

    return user;
}

async function getPublicProfile(username) {
    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'challengesCount']
    });

    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.status = 404;
        throw error;
    }

    return user;
}

async function updateUserProfile(userId, { fullName, bio, photoFilename }) {
    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.status = 404;
        throw error;
    }

    user.fullName = fullName;
    user.bio = bio || null;

    if (photoFilename) {
        const oldPicture = user.profilePicture;

        if (oldPicture && oldPicture !== DEFAULT_PROFILE_PICTURE) {
            fs.unlink(path.join(UPLOADS_DIR, oldPicture), () => {});
        }

        user.profilePicture = photoFilename;
    }

    await user.save();

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        challengesCount: user.challengesCount,
        isAdmin: user.isAdmin
    };
}

module.exports = { registerUser, loginUser, getUserProfile, getPublicProfile, updateUserProfile };
