const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('user/login', { layout: 'start', title: 'Login' });
});

router.get('/register', (req, res) => {
  res.render('user/register', { layout: 'start', title: 'Cadastro' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      req.flash('error_msg', 'Usuário não encontrado');
      return res.redirect('/user/login');
    }

    console.log('Senha digitada:', password);
    console.log('Hash no banco:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado da comparação:', isMatch);
    if (!isMatch) {
      req.flash('error_msg', 'Senha incorreta');
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    req.flash('success_msg', 'Login realizado com sucesso!');
    res.redirect('/home');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    req.flash('error_msg', 'Erro interno no servidor');
    res.redirect('/user/login');
  }
});

router.post('/register', async (req, res) => {
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

    await User.create({ name, email, password: hashedPassword });

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
});

module.exports = router;
