// Define o host e a porta do servidor a partir de variáveis de ambiente ou usa valores por omissão
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const express = require('express');
const app = express();

// Middleware para a ligação à Base de dados MongoDB
const database = require('./app/middleware/database');
database(app);

// Importa as rotas da aplicação
const routes = require('./app/routes');

// Middleware para analisar solicitações com corpo JSON
app.use(express.json());
// Middleware para analisar solicitações com corpo "url encoded"
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos do diretório 'public'
app.use(express.static('public'));

// Middleware para lidar com solicitações CORS
const cors = require("cors");
app.use(cors());
app.options('*', cors());

// Middleware para configurar cabeçalhos de CORS
app.use((req, res, callback) => {
  res.header('Access-Control-Allow-Origin', 'https://my-skills.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Language, Location');
  res.header('Access-Control-Expose-Headers', 'Authorization, Language, Location, X-Access-Token');
  return callback();
});

// Registra as rotas da aplicação
routes(app);

// Configura uma rota wildcard para servir o ficheiro index.html em qualquer pedido que não tenha uma rota ou ficheiro específico no servidor.
// Isto permite que o routing do lado do cliente assuma o controlo e trate do routing dentro da SPA, caso se queira servir a SPA a partir do servidor de express.
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Inicia o servidor
app.listen(port, host, (error) => {
  if (error) throw error;
  console.log('Your app is listening on ' + port);
});
