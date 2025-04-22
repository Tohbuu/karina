const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Utility function for password validation
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, at least one letter, one number, and one special character
function validatePassword(password) {
  return passwordRegex.test(password);
}

// GET Pages
router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));

// POST Register
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', { error: errors.array()[0].msg });
  }

  const { name, email, password, role } = req.body;
  const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser.length > 0) {
    return res.render('register', { error: 'Email already exists!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.render('register', { error: 'Invalid input!' });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
      req.session.user = user[0];
      const redirectPath = user[0].role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      return res.redirect(redirectPath);
    } else {
      res.render('login', { error: 'Invalid email or password!' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('login', { error: 'Something went wrong. Please try again later!' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('500', { message: err.message || 'Internal Server Error' });
});

module.exports = router;
