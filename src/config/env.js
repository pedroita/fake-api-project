const getEnvVariable = (key, isBuffer = false, encoding = 'hex') => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} não configurada nas variáveis de ambiente`);
  
  if (isBuffer) {
    if (/^[0-9a-fA-F]{64}$/.test(value)) return Buffer.from(value, encoding);
    return Buffer.from(value, 'base64');
  }
  
  return value;
};

const config = {
  port: process.env.PORT || 4000,
  aesKey: getEnvVariable('AES_KEY', true),
  endpointUrl: getEnvVariable('ENDPOINT_URL'),
  n8nWebhookUrl: getEnvVariable('N8N_WEBHOOK_URL')
};

module.exports = config;