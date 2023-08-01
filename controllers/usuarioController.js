const connection = require('../models/db')

async function cadastrarUsuario(req, res) {
  const { nomeUser, senha } = req.body;

  try {
    await addUserToDatabase(nomeUser, senha);
    res.redirect('/login');
  } catch (error) {
    res.render('cadastro', { erro: 'Usuário já existe!' });
  }
}

function addUserToDatabase(nomeUser, senha) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO usuarios (nomeUser, senha) VALUES (?, ?)';
    connection.query(query, [nomeUser, senha], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function autenticarUsuario(req, res) {
  const { nomeUser, senha } = req.body;

  try {
    const usuario = await getUserFromDatabase(nomeUser);
    if (usuario && usuario.senha === senha) {
      // Autenticação bem-sucedida. Redirecionar para a página protegida ou exibir uma mensagem de sucesso.
      res.send(`Login realizado com sucesso para o usuário: ${nomeUser}`);
    } else {
      // Credenciais inválidas. Redirecionar para a página de login ou exibir uma mensagem de erro.
      res.render('login', { erro: 'Credenciais inválidas!' });
    }
  } catch (error) {
    // Tratamento de erros.
    res.render('login', { erro: 'Ocorreu um erro ao autenticar o usuário.' });
  }
}

function getUserFromDatabase(nomeUser) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const usuario = results[0]; // Obtem o primeiro usuário encontrado (supondo que nomeUser é único).
        resolve(usuario);
      }
    });
  });
}

module.exports = {
  cadastrarUsuario,
  autenticarUsuario
};
