const express = require('express');
const cors = require('cors');

// In AxonFlow, we will eventually split these into multiple route files
// For now, we'll keep the placeholder for our map routes
const apiRoutes = require('./routes/index');

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. AUTHENTICATION (Mock for Development)
app.use((req, res, next) => {
    // Extract userId from header or default to user_demo_123
    const userId = req.headers['x-user-id'] || 'user_demo_123';
    req.auth = { userId };
    next();
});

// 3. ROUTES
app.use('/api', apiRoutes);

// 4. ERROR HANDLING
app.use((err, req, res, next) => {
    console.error('❌ Error Stack:', err.stack);
    
    // Specific error for Clerk Unauthenticated
    if (err.message === 'Unauthenticated') {
        return res.status(401).json({ error: 'Unauthenticated!' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
