const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csrf = require('csurf');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Check for SESSION_SECRET
if (!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET is not defined in the environment variables.');
    process.exit(1);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(helmet());

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
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
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
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Pizzahub!');
});

try {
    const authRoutes = require('./middleware/auth');
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
    res.status(err.status || 500).render('500', { message: err.message || 'Internal Server Error' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PizzaHub running on http://localhost:${PORT}`);
});
