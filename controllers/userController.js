const User = require("../models/User");

module.exports = {
    login({name, email, password}, res) {
        user.findOne(email);
        
    },

    async registerUser (req, res) {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        res.redirect('/home');
    }
}