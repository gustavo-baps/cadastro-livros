const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');
const saltRounds = 10;

async function cadastrarUsuario(req, res){
  const { nomeUser, senha } = req.body;

  try{
    const hashSenha = await bcrypt.hash(senha, saltRounds);
    await usuarioModel.addUserToDatabase(nomeUser, hashSenha);
    res.redirect('/login');
  }catch(error){
    console.log(error)
    res.render('cadastro', {erro: 'Usuário já existe!'});
  }
}

async function autenticarUsuario(nomeUser, senha){
  try{
    const usuario = await usuarioModel.getUserFromDatabase(nomeUser);
    if(usuario && (await bcrypt.compare(senha, usuario.senha))){
      return usuario;
    } 
    else{
      return null;
    }
  }catch(error){
    throw new Error('Erro ao autenticar o usuário.');
  }
}

async function excluirUsuario(req, res){
  const {nomeUser} = req.body;

  try{
    await usuarioModel.removeUserFromDatabase(nomeUser);
    res.redirect('/login');
  }catch(error){
    res.render('homepage', {usuario: null, erro: 'Erro ao excluir o usuário.'});
  }
}

module.exports = {
  cadastrarUsuario,
  autenticarUsuario,
  excluirUsuario,
};
