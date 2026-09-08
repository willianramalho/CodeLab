const multer = require('multer');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
    }
});

function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error('Formato de imagem inválido. Envie um arquivo JPEG, PNG ou WEBP.'));
    }
    cb(null, true);
}

const profileMulter = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = profileMulter;
