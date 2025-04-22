const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAdmin } = require('../middleware/auth');

// Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  const [pizzas] = await db.execute('SELECT * FROM pizzas');
  const [orders] = await db.execute(`
    SELECT orders.id, users.name as customer, pizzas.name as pizza, orders.quantity, orders.status
    FROM orders
    JOIN users ON orders.user_id = users.id
    JOIN pizzas ON orders.pizza_id = pizzas.id
    ORDER BY orders.id DESC
  `);
  res.render('adminDashboard', { admin: req.session.user, pizzas, orders });
});

// Add Pizza
router.post('/add-pizza', isAdmin, async (req, res) => {
  const { name, description, price, image } = req.body;
  await db.execute(
    'INSERT INTO pizzas (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description, price, image]
  );
  res.redirect('/admin/dashboard');
});

// Delete Pizza
router.post('/delete-pizza/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  await db.execute('DELETE FROM pizzas WHERE id = ?', [id]);
  res.redirect('/admin/dashboard');
});

// Update Order Status
router.post('/order-status/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  res.redirect('/admin/dashboard');
});

module.exports = router;
