const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD } = require('../config/constants');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads', 'challenges');

// O Multer 2.x só cria a pasta de destino sozinho quando `destination` é uma
// string. Aqui `destination` é uma função, então garantimos a pasta na mão.
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `challenge-${req.user.id}-${Date.now()}${ext}`);
    }
});

// Filtro por EXTENSÃO, nunca por MIME: o navegador manda MIME inconsistente
// para arquivos de código (.py, .cs, .go...).
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!UPLOAD.CHALLENGE_EXTENSIONS.includes(ext)) {
        const error = new Error(`Formato de arquivo inválido. Extensões permitidas: ${UPLOAD.CHALLENGE_EXTENSIONS.join(', ')}.`);
        error.status = 400;
        return cb(error);
    }

    cb(null, true);
}

const challengeMulter = multer({
    storage,
    fileFilter,
    limits: { fileSize: UPLOAD.CHALLENGE_MAX_SIZE }
});

module.exports = challengeMulter;
