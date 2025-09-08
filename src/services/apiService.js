const axios = require('axios');

class ApiService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getEncryptedData(url) {
    try {
      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao buscar dados: ${error.message}`);
    }
  }

  async sendToWebhook(url, data) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao enviar para webhook: ${error.message}`);
    }
  }
}

module.exports = new ApiService();