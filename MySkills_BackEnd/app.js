const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const express = require('express');
const app = express();

const database = require('./app/middleware/database');
database(app);

const routes = require('./app/routes');

const cors = require("cors");
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use((req, res, callback) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Language, Location');
  res.header('Access-Control-Expose-Headers', 'Authorization, Language, Location, X-Access-Token');
  return callback();
});

routes(app);

app.listen(port, host, (error) => {
  if (error) throw error;
  console.log('Your app is listening on ' + port);
});
