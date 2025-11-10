const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

module.exports = {
    async registerUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array().map(e => e.msg).join(', '));
            req.flash('formData', JSON.stringify(req.body));
            return res.redirect('/user/register');
        }

        const { name, email, password } = req.body;

        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                req.flash('error_msg', 'E-mail já cadastrado');
                return res.redirect('/user/register');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword });

            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email
            };

            req.flash('success_msg', 'Usuário registrado com sucesso!');
            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            req.flash('error_msg', 'Erro ao registrar usuário');
            res.redirect('/user/register');
        }
    },

    async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array().map(e => e.msg).join(', '));
            req.flash('formData', JSON.stringify(req.body));
            return res.redirect('/user/login');
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                req.flash('error_msg', 'Usuário não encontrado');
                return res.redirect('/user/login');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                req.flash('error_msg', 'Senha incorreta');
                return res.redirect('/user/login');
            }

            req.session.user = {
                name: user.name,
                email: user.email,
            };

            req.flash('success_msg', 'Login realizado com sucesso!');
            res.redirect('/idea/home');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            req.flash('error_msg', 'Erro interno no servidor');
            res.redirect('/user/login');
        }
    },

    async logout(req, res) {
        req.session = null;
        res.clearCookie('connect.sid');
        res.redirect('/user/login');
        }
    }
