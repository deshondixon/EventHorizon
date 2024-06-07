const express = require('express');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const routes = require('./controllers/api');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
