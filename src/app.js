require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { validateEnvironment, port } = require('./config/environment');
const decryptRoutes = require('./routes/decryptRoutes');
const errorHandler = require('./middlewares/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.port = port;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    this.app.use('/api', decryptRoutes);
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  initializeSwagger() {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'AES Decryptor Service API',
          version: '1.0.0',
          description: 'API para descriptografar dados AES-256-GCM e enviar para webhook',
        },
        servers: [
          {
            url: `http://localhost:${this.port}`,
            description: 'Development server',
          },
        ],
      },
      apis: ['./src/routes/*.js'],
    };

    const specs = swaggerJsdoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  start() {
    validateEnvironment();
    
    this.app.listen(this.port, () => {
      console.log(`✅ Server rodando na porta ${this.port}`);
      console.log(`📚 Documentação disponível em: http://localhost:${this.port}/api-docs`);
    });
  }
}

const server = new App();
server.start();

module.exports = server;