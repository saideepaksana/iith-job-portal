require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');  // we’ll create this next

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('🚀 Backend is healthy');
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Listening on port ${process.env.PORT}`);
});
