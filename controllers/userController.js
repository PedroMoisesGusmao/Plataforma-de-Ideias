const { validationResult } = require('express-validator');
const User = require("../models/User");
 
module.exports = {
    async login(req, res) {
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array().map(e => e.msg).join(', '));
            req.flash('formData', JSON.stringify(req.body));
            return res.redirect('/user/login');
        }
        
        const { email, password } = req.body;
 
        try {
            const user = await User.findByEmail(email);
            if (!user || !(user.comparePassword(password))) {
                req.flash('error_msg', 'E-mail ou senha inválidos');
                req.flash('formData', JSON.stringify(req.body));
                return res.redirect('/user/login');
            }
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Erro ao registrar usuário');
            res.redirect('/user/login');
        }
    },
 
    async registerUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array().map(e => e.msg).join(', '));
            req.flash('formData', JSON.stringify(req.body));
            return res.redirect('/user/register');
        }
 
        const { name, email, password } = req.body;
 
        try {
            const userExists = await User.findByEmail(email);
 
            if (userExists) {
                req.flash('error_msg', 'E-mail já cadastrado');
                req.flash('formData', JSON.stringify(req.body));
                return res.redirect('/user/register');
            }
 
            await User.create({ name, email, password });
 
            req.flash('success_msg', 'Usuário registrado com sucesso!');
            res.redirect('/user/login');

        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Erro ao registrar usuário');
            res.redirect('/user/register');
        }
    }
};
 
 