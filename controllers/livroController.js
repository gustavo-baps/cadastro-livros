const livroModel = require('../models/livroModel');

async function cadastrarLivro(req, res){
  const livroData = req.body;

  try{
    const livroExiste = await livroModel.checkLivro(livroData.titulo);
    if(livroExiste){
      res.render('cadastroLivro', {erro: 'Livro já existe'});
    }
    else{
      await livroModel.addLivroToDatabase(livroData);
      res.redirect('/livros');
    }
  }catch(error){
    res.render('cadastroLivro', {erro: 'Erro ao cadastrar livro.'});
  }
}
async function excluirLivro(req, res){
    const {id} = req.body;
    try{
        await livroModel.deleteLivroFromDatabase(id);
        res.redirect('/livros');
    }catch(error){
        res.render('livros', {erro: 'Erro ao excluir o livro'});
    }
}

module.exports = {
  cadastrarLivro,
  excluirLivro
};
