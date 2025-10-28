const { validationResult } = require('express-validator');
const User = require("../models/User");
 
module.exports = {
    async login(req, res) {},
 
    async registerUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const { name, email, password } = req.body;
 
        try {
            const userExists = await User.findOne({ where: { email } });
 
            if (userExists) {
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }
 
            await User.create({ name, email, password });
 
            res.redirect('/home');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao registrar usuário' });
        }
    }
};
 
 