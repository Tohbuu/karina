const express = require('express');
const cors = require('cors');
const pizzaRoutes = require('./routes/pizzaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', pizzaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
