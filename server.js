const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Temporary storage (demo purpose)
let users = [];

// SIGNUP API
app.post('/api/signup', (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Check duplicate username
    const exists = users.find(u => u.user === user);
    if (exists) {
        return res.status(400).json({ error: "Username already exists" });
    }

    users.push({ user, pass });

    res.json({ success: true });
});

// LOGIN API
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    const found = users.find(u => u.user === user && u.pass === pass);

    if (found) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid Login" });
    }
});

// ROOT (open HTML page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login support.html'));
});

// PORT (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port " + PORT);
});
