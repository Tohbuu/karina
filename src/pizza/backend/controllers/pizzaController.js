const Pizza = require('../models/pizzaModel');

exports.fetchPizzas = (req, res) => {
  Pizza.getAllPizzas((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
