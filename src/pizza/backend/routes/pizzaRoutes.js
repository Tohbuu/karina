const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');

router.get('/pizzas', pizzaController.fetchPizzas);

module.exports = router;




const jwt = require('jsonwebtoken');

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, 'pizza_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
}

// CREATE Pizza
router.post('/pizzas', auth, adminOnly, (req, res) => {
  const { name, description, price, image_url } = req.body;
  db.query('INSERT INTO pizzas (name, description, price, image_url) VALUES (?, ?, ?, ?)',
    [name, description, price, image_url], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Pizza added' });
    });
});

// UPDATE Pizza
router.put('/pizzas/:id', auth, adminOnly, (req, res) => {
  const { name, description, price, image_url } = req.body;
  db.query('UPDATE pizzas SET name=?, description=?, price=?, image_url=? WHERE id=?',
    [name, description, price, image_url, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Pizza updated' });
    });
});

// DELETE Pizza
router.delete('/pizzas/:id', auth, adminOnly, (req, res) => {
  db.query('DELETE FROM pizzas WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pizza deleted' });
  });
});


// Place an order
router.post('/orders', auth, (req, res) => {
    const { pizza_id, quantity } = req.body;
    const user_id = req.user.id;
  
    db.query('INSERT INTO orders (user_id, pizza_id, quantity) VALUES (?, ?, ?)',
      [user_id, pizza_id, quantity], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order placed' });
      });
  });
  
  // Admin view all orders
  router.get('/orders', auth, adminOnly, (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
  