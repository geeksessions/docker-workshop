const express = require('express');
const process = require('process');
const _ = require('lodash');
const db = require('./db');

const router = express.Router();

// ROUTER ENDPOINTS
// curl http://localhost:3001/api/counter
router.get('/counter', async (req, res) => {
  const result = await db.getDataCounter();
  const value = _.get(result, 'value', 0);
  res.json({ value });
});

// curl -X POST -H "Content-Type: application/json" -d '{"value":10}' http://localhost:3001/api/counter
router.post('/counter', async (req, res) => {
  console.log('POST datacounter=%d', req.body.value);
  db.setDataCounter(req.body.value);
  res.sendStatus(200);
});

// curl http://localhost:3001/api/ddos
router.get('/ddos', async (req, res) => {
  process.exit(1);
});


module.exports = router;
