const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper: verify IITH email
const isIITHEmail = email => email.endsWith('@iith.ac.in');

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, year } = req.body;
  if (!isIITHEmail(email)) return res.status(400).json({ error: 'Use your @iith.ac.in email' });
  if (![3,4].includes(year)) return res.status(400).json({ error: 'Year must be 3 or 4' });

  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO users (name,email,password_hash,role,year) VALUES (?,?,?,?,?)',
      [name, email, hash, 'student', year]
    );
    res.sendStatus(201);
  } catch (e) {
    res.status(500).json({ error: 'User exists or DB error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, year: user.year }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, name: user.name, role: user.role });
});

module.exports = router;