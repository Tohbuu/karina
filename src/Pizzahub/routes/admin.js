const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); // Updated import
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads/')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});

// Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const [pizzas] = await db.execute('SELECT * FROM pizzas');
    const [orders] = await db.execute(`
      SELECT orders.id, users.name as customer, pizzas.name as pizza, orders.quantity, orders.status
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN pizzas ON orders.pizza_id = pizzas.id
      ORDER BY orders.id DESC
    `);
    res.render('adminDashboard', { admin: req.session.user, pizzas, orders, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Pizza
router.post(
  '/add-pizza',
  upload.single('image'),
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    check('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('adminDashboard', {
        admin: req.session.user,
        pizzas: [],
        orders: [],
        csrfToken: req.csrfToken(),
        errors: errors.array(),
      });
    }

    try {
      const { name, price, description } = req.body;
      const image = req.file.filename;
      await db.execute('INSERT INTO pizzas (name, description, price, image) VALUES (?, ?, ?, ?)', [
        name,
        description,
        price,
        image,
      ]);
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Error adding pizza:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Delete Pizza
router.post('/delete-pizza/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    await db.execute('DELETE FROM pizzas WHERE id = ?', [id]);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting pizza:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Order Status
router.post('/order-status/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Internal Server Error');
  }
});

// View Orders
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT o.id, u.name AS user, p.name AS pizza, o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN pizzas p ON o.pizza_id = p.id
      ORDER BY o.created_at DESC
    `;
    const [orders] = await db.execute(sql, [req.session.user.id]);
    res.render('adminOrders', { admin: req.session.user, orders, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Orders
router.post('/orders/update', isAdmin, async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.redirect('/admin/orders');
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Order Status
router.post('/update-order-status', async (req, res, next) => {
  try {
    const { orderId, status } = req.body;
    const [order] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order.length) {
      return res.status(404).render('404', { message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.redirect('/admin/orders');
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
});



module.exports = router;