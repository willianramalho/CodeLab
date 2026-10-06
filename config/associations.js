// Centraliza todas as associações entre models da aplicação.
//
// Por quê aqui, e não dentro dos models? Se challengeModel.js desse
// require('../user/userModel') para declarar o belongsTo, e userModel.js
// desse require('../challenge/challengeModel') para declarar o hasMany,
// teríamos um ciclo de require no CommonJS: um dos dois receberia o
// module.exports do outro ainda incompleto, e a chamada de associação
// explodiria. Importando os dois aqui, depois que ambos já estão
// totalmente definidos, o ciclo não existe.
//
// Este arquivo precisa ser carregado ANTES de sequelize.sync(), senão a
// tabela challenges nasce sem a foreign key.
const User = require('../modules/user/userModel');
const Challenge = require('../modules/challenge/challengeModel');

// As duas pontas declaram a MESMA especificação de foreignKey. No Sequelize
// 6.37.8, a primeira associação declarada fixa allowNull/onDelete da FK
// (mergeDefaults não sobrescreve), então deixar os dois lados idênticos
// evita depender da ordem das linhas abaixo.
User.hasMany(Challenge, {
    foreignKey: { name: 'userId', allowNull: false },
    as: 'challenges',
    onDelete: 'CASCADE'
});

Challenge.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    as: 'author',
    onDelete: 'CASCADE'
});

module.exports = { User, Challenge };
