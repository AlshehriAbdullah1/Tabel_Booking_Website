const sqlite3 = require('sqlite3').verbose();

// Open a database connection and create a table for storing image file names
const db = new sqlite3.Database('images.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    db.run('CREATE TABLE IF NOT EXISTS images(customer_id INTEGER, file_name TEXT)');
  }
});

// Function to insert a new image file name into the database
function insertImage(customerId, fileName) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO images(customer_id, file_name) VALUES(?, ?)', [customerId, fileName], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Function to retrieve the file name of the customer's image from the database
function getImageFileNameForCustomer(customerId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT file_name FROM images WHERE customer_id = ?', [customerId], function(err, row) {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.file_name : null);
      }
    });
  });
}

module.exports = { insertImage, getImageFileNameForCustomer };
