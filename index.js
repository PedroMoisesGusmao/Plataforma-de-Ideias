const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');
const ideaRoute = require('./routes/ideaRoute');
const userRoute = require('./routes/userRoute');
 
const app = express();
const PORT = 3000;
 
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
 
app.use('/idea', ideaRoute);
app.use('/user', userRoute);
app.get('/', (req, res) => res.redirect('/home'));
 
conn
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log('❌ Erro ao conectar com o banco de dados:', err));