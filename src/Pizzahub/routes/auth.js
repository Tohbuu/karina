const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// GET Pages
router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));

// POST Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    );
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.render('register', { error: 'Email already exists!' });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
      req.session.user = user[0];
      return res.redirect(user[0].role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials!' });
    }
  } catch (error) {
    console.log(error);
    res.render('login', { error: 'Something went wrong!' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;


function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
  }
  
  function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') return next();
    res.redirect('/login');
  }
  
  module.exports = { isAuthenticated, isAdmin };
  