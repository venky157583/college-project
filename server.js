const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// DB
const db = new Database('./database.db');

// Create table
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)
`).run();

// SIGNUP
app.post('/api/signup', (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
          .run(user, pass);
        res.json({ success: true });
    } catch {
        res.status(400).json({ error: "Username already exists" });
    }
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    const row = db.prepare(
        "SELECT * FROM users WHERE username=? AND password=?"
    ).get(user, pass);

    if (row) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid Login" });
    }
});

// VIEW USERS
app.get('/api/users', (req, res) => {
    const rows = db.prepare("SELECT * FROM users").all();
    res.json(rows);
});

// ROOT FIX
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login support.html'));
});

// PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port " + PORT);
});
