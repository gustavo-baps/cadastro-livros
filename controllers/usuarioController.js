const connection = require('../models/db')

async function cadastrarUsuario(req, res){
  const { nomeUser, senha } = req.body;

  try{
    await addUserToDatabase(nomeUser, senha);
    res.redirect('/login');
  }catch(error){
    res.render('cadastro', { erro: 'Usuário já existe!' });
  }
}

function addUserToDatabase(nomeUser, senha){
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO usuarios (nomeUser, senha) VALUES (?, ?)';
    connection.query(query, [nomeUser, senha], (err, results) => {
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    });
  });
}

async function autenticarUsuario(nomeUser, senha) {
  try {
    const usuario = await getUserFromDatabase(nomeUser);
    if (usuario && usuario.senha === senha) {
      // Autenticação bem-sucedida, retornar o usuário autenticado
      return usuario;
    } else {
      // Credenciais inválidas, retornar null
      return null;
    }
  } catch (error) {
    // Tratamento de erros
    throw new Error('Erro ao autenticar o usuário.');
  }
}

function getUserFromDatabase(nomeUser) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if(err){
        reject(err);
      }else{
        const usuario = results[0]; //pega o primeiro usuário encontrado (supondo que nomeUser é único).
        resolve(usuario);
      }
    });
  });
}

async function excluirUsuario(req, res) {
  const { nomeUser } = req.body;

  try {
    await removeUserFromDatabase(nomeUser);
    res.redirect('/login');
  } catch (error) {
    res.render('homepage', { usuario: null, erro: 'Erro ao excluir o usuário.' });
  }
}

function removeUserFromDatabase(nomeUser) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  cadastrarUsuario,
  autenticarUsuario,
  getUserFromDatabase,
  excluirUsuario
};