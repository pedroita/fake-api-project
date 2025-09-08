require('dotenv').config();
const express = require('express');
const cors = require('cors');
const decryptRoutes = require('./routes/decryptRoute');

const app = express();

// 🔹 Configuração de CORS para aceitar apenas seu frontend
const allowedOrigins = [
  'https://n8n-table-app.vercel.app'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // permite Postman ou curl
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS não permitido para este origin'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Pragma','Expires','Cache-Control'],
  credentials: true
}));

// Middlewares para body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', decryptRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ 
    status: 'error', 
    message: 'Erro interno do servidor' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Endpoint não encontrado' 
  });
});

module.exports = app;
