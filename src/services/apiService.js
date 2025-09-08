const axios = require('axios');
const { decryptAES256GCM } = require('../middlewares/crypto.js');

const config = require('../config/env');

class ApiService {
  constructor() {
    this.timeout = 10000;
  }

  async fetchEncryptedData() {
    try {
      const response = await axios.get(config.endpointUrl, { 
        timeout: this.timeout 
      });
      
      const encryptedData = response.data?.data?.encrypted;
      if (!encryptedData) {
        throw new Error('Dados criptografados não encontrados na resposta');
      }
      
      return encryptedData;
    } catch (error) {
      throw new Error(`Erro ao buscar dados: ${error.message}`);
    }
  }

  async sendToN8N(data) {
    try {
      const response = await axios.post(config.n8nWebhookUrl, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: this.timeout
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao enviar para N8N: ${error.message}`);
    }
  }

  async processData() {
    try {
      // 1. Buscar dados criptografados
      const encryptedData = await this.fetchEncryptedData();
      
      // 2. Descriptografar
      const decryptedText = decryptAES256GCM(encryptedData, config.aesKey);
      
      // 3. Parse dos dados
      let parsedData;
      try {
        parsedData = JSON.parse(decryptedText);
      } catch {
        parsedData = decryptedText;
      }
      
      // 4. Enviar para N8N
      const n8nResponse = await this.sendToN8N(parsedData);
      
      return {
        success: true,
        recordsProcessed: Array.isArray(parsedData) ? parsedData.length : 1,
        n8nResponse
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ApiService();