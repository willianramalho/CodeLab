const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator, loginValidator, profileUpdateValidator } = require('./userValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const isAuthenticated = require('../../middlewares/auth');
const profileMulter = require('../../middlewares/profileMulter');

// Envolve o multer para transformar qualquer erro dele (tipo inválido, arquivo
// grande demais) num 400 tratado pelo errorHandler central, em vez de um 500.
function uploadProfilePhoto(req, res, next) {
    profileMulter.single('photo')(req, res, (err) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        next();
    });
}

router.post('/register', registerValidator, asyncHandler(userController.register));
router.post('/login', loginValidator, asyncHandler(userController.login));
router.post('/logout', asyncHandler(userController.logout));

router.get('/profile/me', isAuthenticated, asyncHandler(userController.getMyProfile));
router.put('/profile/me', isAuthenticated, uploadProfilePhoto, profileUpdateValidator, asyncHandler(userController.updateProfile));
router.get('/profile/:username', asyncHandler(userController.getPublicProfile));

module.exports = router;
