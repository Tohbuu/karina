const db = require('../config/db');

exports.getAllPizzas = (callback) => {
  const sql = 'SELECT * FROM pizzas';
  db.query(sql, callback);
};
