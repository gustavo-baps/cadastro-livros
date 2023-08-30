const connection = require('./db');

function addUserToDatabase(nomeUser, senha){
  return new Promise((resolve, reject) =>{
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

async function getUserFromDatabase(nomeUser){
  return new Promise((resolve, reject) =>{
    const query = 'SELECT * FROM usuarios WHERE nomeUser = ?';
    connection.query(query, [nomeUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const usuario = results[0];
        resolve(usuario);
      }
    });
  });
}

function removeUserFromDatabase(nomeUser){
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
  addUserToDatabase,
  getUserFromDatabase,
  removeUserFromDatabase,
};
