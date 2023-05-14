const fs = require('fs');

function writeFileAsync(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  
  function readFileAsync(path) {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }


    module.exports={writeFileAsync,readFileAsync}