const encryptionService = require('../services/encryptionService');
const apiService = require('../services/apiService');
const { endpointUrl, n8nWebhookUrl } = require('../config/environment');

class DecryptController {
  async fetchDecryptAndSend(req, res, next) {
    try {
      const encryptedData = await apiService.getEncryptedData(endpointUrl);
      const encObj = encryptedData?.data?.encrypted;
      
      if (!encObj) {
        throw new Error('Payload criptografado não encontrado na resposta');
      }

      const plainText = encryptionService.decryptAES256GCM(encObj);
      const parsedData = encryptionService.parseDecryptedData(plainText);

      console.log(`🔓 Dados descriptografados, enviando ${Array.isArray(parsedData) ? parsedData.length : 1} registros...`);

      const n8nResponse = await apiService.sendToWebhook(n8nWebhookUrl, parsedData);
      console.log("✅ Dados enviados com sucesso");

      res.json({
        status: 'success',
        message: 'Dados descriptografados e enviados com sucesso',
        recordsSent: Array.isArray(parsedData) ? parsedData.length : 1,
        n8nResponse: n8nResponse
      });

    } catch (error) {
      next(error);
    }
  }

  healthCheck(req, res) {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'AES Decryptor Service'
    });
  }
}

module.exports = new DecryptController();