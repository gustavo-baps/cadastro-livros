const express = require('express');
const app = express();
const path = require('path');
const connection = require('./models/db');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const usuarioController = require('./controllers/usuarioController');
const usuarioModel = require('./models/usuarioModel');
const livroController = require('./controllers/livroController');
const livroModel = require('./models/livroModel');

app.use(
  session({
    secret: 'bobalhao',
    resave: false,
    saveUninitialized: false,
  })
);

function requireAuth(req, res, next){
  if(req.session.nomeUser){
    next(); //o usuário está autenticado, continua com a rota
  } 
  else{
    res.redirect('/login'); //usuário não está autenticado, redireciona pra página de login
  }
}

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { erro: null });
});

app.post('/cadastro', usuarioController.cadastrarUsuario);

app.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

app.post('/login', async (req, res) => {
  const {nomeUser, senha} = req.body;

  try{
    const usuario = await usuarioController.autenticarUsuario(nomeUser, senha);

    if(usuario){
      req.session.nomeUser = nomeUser;

      res.redirect('/livros');
    } 
    else{
      res.render('login', {erro: 'Credenciais inválidas!'});
    }
  }catch(error){
    res.render('login', {erro: 'Erro ao autenticar o usuário.'});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/homepage', requireAuth, async (req, res) => {
  try{
    const usuario = await usuarioModel.getUserFromDatabase(req.session.nomeUser);
    console.log(usuario);
    res.render('homepage', { usuario, erro: null });
  }catch(error){
    res.render('homepage', { usuario: null, erro: 'Erro ao carregar os dados do usuário.' });
    console.log('erro');
  }
});

app.get('/livros', requireAuth, async (req, res) => {
  try{
    const livros = await livroModel.getLivroFromDatabase(); 

    res.render('livros', { livros, erro: null });
  }catch(error){
    res.render('livros', {livros: [], erro: 'Erro ao carregar livros.'});
  }
});

app.get('/cadastroLivro', requireAuth, (req, res) => {
  res.render('cadastroLivro', { erro: null });
});

app.post('/cadastrarLivro', requireAuth, livroController.cadastrarLivro);
app.post('/deleteLivro', requireAuth, livroController.excluirLivro);


app.post('/delete', requireAuth, usuarioController.excluirUsuario);