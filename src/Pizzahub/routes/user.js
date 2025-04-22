const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, async (req, res) => {
  const [pizzas] = await db.execute('SELECT * FROM pizzas');
  res.render('userDashboard', { user: req.session.user, pizzas });
});

// Handle Pizza Order
router.post('/order/:id', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const pizzaId = req.params.id;
  const quantity = req.body.quantity || 1;

  await db.execute(
    'INSERT INTO orders (user_id, pizza_id, quantity) VALUES (?, ?, ?)',
    [userId, pizzaId, quantity]
  );

  res.redirect('/user/dashboard');
});

module.exports = router;
