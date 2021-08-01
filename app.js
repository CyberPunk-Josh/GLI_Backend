const express = require('express');
const bodyParser = require('body-parser');
let cors = require('cors')

const app = express();
const { API_VERSION } = require('./config');

// Load routings
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure header HTTP enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

// Router basics
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);

// habilitar cors:
app.use(cors());

module.exports = app;