const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));

// DB connect
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.log(err);
    else console.log("SQLite Connected");
});

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
`);

// SIGNUP
app.post('/api/signup', (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(sql, [user, pass], function(err){
        if (err) {
            return res.status(400).json({ error: "Username already exists" });
        }
        res.json({ success: true });
    });
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    const sql = `SELECT * FROM users WHERE username=? AND password=?`;

    db.get(sql, [user, pass], (err, row) => {
        if (row) {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: "Invalid Login" });
        }
    });
});

// VIEW USERS
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        res.json(rows);
    });
});

// ROOT FIX (IMPORTANT)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login support.html'));
});

// PORT FIX (Render ready)
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port " + PORT);
});