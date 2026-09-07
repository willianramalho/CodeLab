var express = require('express');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRoutes = require('./modules/search/searchRoutes');
var userRoutes = require('./modules/user/userRoutes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

// --- Middlewares globais ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS: permite que o front-end Vue (rodando em outra origem/porta) consuma a API.
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// --- Montagem das rotas da API ---
// Todas as rotas ficam sob o prefixo /api (ex: /api/register, /api/videos).
app.use('/api', indexRouter);
app.use('/api', searchRoutes);
app.use('/api', userRoutes);

// Captura qualquer rota não tratada pelos routers acima
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.',
        errors: []
    });
});

// Middleware de erro centralizado — precisa ser o último app.use() do arquivo,
// pois só é alcançado via next(err), nunca pela ordem normal de execução.
app.use(errorHandler);

const sequelize = require('./config/database');
sequelize.sync({ alter: true })
    .then(() => console.log('Banco de dados sincronizado!'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;