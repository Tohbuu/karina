const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Dashboard Route
router.get('/dashboard', isAuthenticated, async (req, res, next) => {
  try {
    const [pizzas] = await db.execute('SELECT * FROM pizzas');
    res.render('userDashboard', { user: req.session.user, pizzas });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

// Handle Pizza Order
router.post(
  '/order/:id',
  isAuthenticated,
  [
    param('id').isInt().withMessage('Invalid pizza ID'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.session.user.id;
      const pizzaId = req.params.id;
      const quantity = req.body.quantity || 1;

      await db.execute(
        'INSERT INTO orders (user_id, pizza_id, quantity) VALUES (?, ?, ?)',
        [userId, pizzaId, quantity]
      );

      res.redirect('/user/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Order History Route
router.get('/history', isAuthenticated, async (req, res) => {
  const sql = `
    SELECT o.id, p.name AS pizza_name, p.price, o.status, o.created_at
    FROM orders o
    JOIN pizzas p ON o.pizza_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  try {
    const [orders] = await db.execute(sql, [req.session.user.id]);
    res.render('orderHistory', { user: req.session.user, orders });
  } catch (error) {
    console.error(error);
    res.render('orderHistory', { user: req.session.user, message: 'Unable to load your order history. Please try again later.' });
  }
});

// Profile Routes
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).render('404', { message: 'User not found' });
    }
    res.render('userProfile', { user });
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
});

router.post(
  '/profile',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('userProfile', {
        user: req.session.user,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, password } = req.body;
    const userId = req.session.user.id;

    try {
      let sql, params;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        sql = 'UPDATE users SET name = ?, password = ? WHERE id = ?';
        params = [name, hashedPassword, userId];
      } else {
        sql = 'UPDATE users SET name = ? WHERE id = ?';
        params = [name, userId];
      }

      await db.execute(sql, params);

      req.session.user.name = name;
      res.render('userProfile', { user: req.session.user, message: 'Profile updated!' });
    } catch (err) {
      console.error(err);
      res.render('userProfile', { user: req.session.user, message: 'Update failed' });
    }
  }
);

// Search Route
router.get('/search', isAuthenticated, async (req, res) => {
  const keyword = req.query.q;
  const sql = 'SELECT * FROM pizzas WHERE name LIKE ?';

  try {
    const [pizzas] = await db.execute(sql, [`%${keyword}%`]);
    res.render('userDashboard', { user: req.session.user, pizzas });
  } catch (err) {
    console.error(err);
    res.render('userDashboard', { user: req.session.user, message: 'Search failed. Please try again later.' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('500', { message: err.message || 'Internal Server Error' });
});

module.exports = router;