const encryptionService = require('../services/encryptionService');
const apiService = require('../services/apiService');
const { endpointUrl, n8nWebhookUrl } = require('../config/environment');

class DecryptController {
  async fetchDecryptAndSend(req, res, next) {
    try {
      // 1) Buscar do endpoint
      const encryptedData = await apiService.getEncryptedData(endpointUrl);
      const encObj = encryptedData?.data?.encrypted;
      if (!encObj) throw new Error('Payload criptografado não encontrado');

      // 2) Descriptografar
      const plainText = encryptionService.decryptAES256GCM(encObj);
      const parsedData = encryptionService.parseDecryptedData(plainText);
      console.log("🔓 Dados descriptografados (antes do envio):");
    console.dir(parsedData, { depth: null });  // 👈 mostra os dados inteiros no terminal
      console.log(`🔓 ${Array.isArray(parsedData) ? parsedData.length : 1} registros descriptografados`);

      // 3) Enviar ao N8N
      const n8nResponse = await apiService.sendToWebhook(n8nWebhookUrl, parsedData);
      console.log("✅ Enviado ao N8N");

      res.json({
        status: 'success',
        records: Array.isArray(parsedData) ? parsedData.length : 1,
        n8nResponse
      });
    } catch (err) {
      next(err);
    }
  }

  healthCheck(req, res) {
    res.json({
      status: 'healthy',
      service: 'AES Decryptor',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new DecryptController();
