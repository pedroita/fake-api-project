const getKeyFromEnv = () => {
  const raw = process.env.AES_KEY;
  if (!raw) throw new Error('AES_KEY não setada (env). Deve ser 32 bytes em hex ou base64.');
  if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, 'hex');
  return Buffer.from(raw, 'base64');
};

const validateEnvironment = () => {
  const required = ['AES_KEY', 'ENDPOINT_URL', 'N8N_WEBHOOK_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }
};

module.exports = {
  getKeyFromEnv,
  validateEnvironment,
  port: process.env.PORT || 4000,
  endpointUrl: process.env.ENDPOINT_URL,
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};