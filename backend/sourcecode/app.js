const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// $> curl http://localhost:3001/api/healthcheck
app.use('/api/healthcheck', require('express-healthcheck')());

app.use('/api', routes);

module.exports = app;
