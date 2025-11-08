const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('user/login', { layout: 'start', title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('user/register', { layout: 'start', title: 'Cadastro' });
});

router.post('/register',
    [
        body('name')
            .notEmpty().withMessage('O nome é obrigatório')
            .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),

        body('email')
            .isEmail().withMessage('E-mail inválido'),

        body('password')
            .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
    ],
    userController.registerUser
);

router.post('/login',
    [
        body('email')
            .isEmail().withMessage('E-mail inválido'),

        body('password')
            .notEmpty().withMessage('A senha é obrigatória')
    ],
    userController.login
);

module.exports = router;