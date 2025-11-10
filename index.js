const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const conn = require('./db/conn');
const helmet = require('helmet');
const ideaRoute = require('./routes/ideaRoute');
const userRoute = require('./routes/userRoute');
const voteRoute = require('./routes/voteRoute');

const app = express();
const PORT = 3000;

app.use(helmet());

const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a === b
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
 
app.use(
  session({
    secret: 'token unico',
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());
app.use(cookieParser());

app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');    
  next();
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error_msg', 'Erro de segurança na validação do formulário. Por favor, tente novamente.');
    return res.redirect('back');
  }
  next(err);
});

app.use('/idea', ideaRoute);
app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.render('start', { layout: 'start', title: 'Bem vindo!!' });
});

app.use('/vote', voteRoute);

conn()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log('❌ Erro ao conectar com o banco de dados:', err));