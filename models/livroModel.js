const connection = require('./db');

function addLivroToDatabase(livroData){
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO livros (titulo, resenha, autor, categoria, isbn, editora, imagem_capa) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [livroData.titulo, livroData.resenha, livroData.autor, livroData.categoria, livroData.isbn, livroData.editora, livroData.imagem_capa];
    connection.query(query, values, (err, results) => {
      if(err){
        reject(err);
      } 
      else{
        resolve(results);
      }
    });
  });
}
function deleteLivroFromDatabase(id){
    return new Promise((resolve, reject)=>{
        const query = 'DELETE FROM livros WHERE id = ?';
        connection.query(query, [id], (err, results)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(results);
            }
        });
    });
}
async function getLivroFromDatabase(){
  return new Promise((resolve, reject) =>{
    const query = 'SELECT * FROM livros';
    connection.query(query, (err, results) => {
      if(err){
        reject(err);
      } 
      else{
        resolve(results);
      }
    });
  });
}
async function getLivroById(id){
  return new Promise((resolve, reject)=>{
    const query = `SELECT * FROM livros WHERE id = ?`;
    connection.query(query, [id], (err, results)=>{
      if(err){
        reject(err);
      }
      else{
        if(results.length > 0){
          resolve(results[0]);
        }
        else{
          resolve(null);
        }
      }
    });
  });
}
async function checkLivro(titulo){
  return new Promise((resolve, reject)=>{
    const query = 'SELECT COUNT(*) AS count FROM livros WHERE titulo = ?';
    connection.query(query, [titulo], (err, results)=>{
      if(err){
        reject(err);
      }
      else{
        const count = results[0].count;
        resolve(count > 0);
      }
    })
  })
}
module.exports = {
  addLivroToDatabase,
  deleteLivroFromDatabase,
  getLivroFromDatabase,
  checkLivro,
  getLivroById
};
