const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csrf = require('csurf');
require('dotenv').config();

const app = express();

// Check for SESSION_SECRET
if (!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET is not defined in the environment variables.');
    process.exit(1);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, '../src')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '/uploads/<%= pizza.image %>');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

// Routes
try {
    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/user');
    const adminRoutes = require('./routes/admin');

    app.use('/', authRoutes);
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
} catch (error) {
    console.error('Error loading routes:', error.message);
}

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { message: 'Internal Server Error' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PizzaHub running on http://localhost:${PORT}`);
});
