const express = require('express');
const app = express();
const path = require('path');
const connection = require('./models/db');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const usuarioController = require('./controllers/usuarioController');

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { erro: null });
});

app.post('/cadastro', usuarioController.cadastrarUsuario);

app.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

app.post('/login', usuarioController.autenticarUsuario);

app.get('/homepage', (req, res) => {
  res.render('homepage', { erro: null });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
