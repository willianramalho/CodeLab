const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');

// Primeiro model de conteúdo do CodeLab além do User (Aula 07).
// A associação com User NÃO é declarada aqui, e sim em config/associations.js,
// para evitar referência circular entre os dois models (ver guia X1).
const Challenge = sequelize.define('Challenge',
    {
        id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title:       { type: DataTypes.STRING(VALIDATION.TITLE_MAX), allowNull: false },
        description: { type: DataTypes.STRING(VALIDATION.DESCRIPTION_MAX), allowNull: true },
        // Guarda só o nome do arquivo em disco, igual a profilePicture em User.
        sourceCode:  { type: DataTypes.STRING, allowNull: false }
    },
    {
        timestamps: true,
        tableName: 'challenges'
    }
);

module.exports = Challenge;
