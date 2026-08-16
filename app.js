var express = require('express');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');

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

// Captura qualquer rota não tratada pelos routers acima
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.',
        errors: []
    });
});

module.exports = app;