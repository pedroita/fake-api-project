const app = require('./app');
const config = require('./config/env');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check disponível em: http://localhost:${PORT}/health`);
  console.log(`🔓 Endpoint principal: http://localhost:${PORT}/api/fetch-and-decrypt`);
});