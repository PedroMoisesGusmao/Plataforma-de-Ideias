const User = require("../models/User");

module.exports = {
    login(req, res) {
        const {email, password} = req.body;
        const user = User.find(email);
        if (user.comparePassword(password)) {
            res.redirect('/home');
        }
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