const connection = require('../models/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function cadastrarUsuario(req, res){
  const {nomeUser, senha} = req.body;

  try {
    //hash da senha usando bcrypt antes de salvar no banco de dados
    const hashSenha = await bcrypt.hash(senha, saltRounds);

    await addUserToDatabase(nomeUser, hashSenha);
    res.redirect('/login');
  } catch (error) {
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

async function autenticarUsuario(nomeUser, senha){
  try{
    const usuario = await getUserFromDatabase(nomeUser);
    if(usuario && await bcrypt.compare(senha, usuario.senha)){
      //autenticação bem-sucedida, retornar o usuário autenticado
      return usuario;
    } 
    else{
      //credenciais inválidas, retornar null
      return null;
    }
  }catch(error){
    //tratamento de erros
    throw new Error('Erro ao autenticar o usuário.');
  }
}

function getUserFromDatabase(nomeUser){
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if(err){
        reject(err);
      }
      else{
        const usuario = results[0]; //pega o primeiro usuário encontrado (supondo que nomeUser é único).
        resolve(usuario);
      }
    });
  });
}

async function excluirUsuario(req, res){
  const {nomeUser} = req.body;

  try{
    await removeUserFromDatabase(nomeUser);
    res.redirect('/login');
  }catch(error){
    res.render('homepage', { usuario: null, erro: 'Erro ao excluir o usuário.' });
  }
}

function removeUserFromDatabase(nomeUser){
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if(err){
        reject(err);
      } 
      else{
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