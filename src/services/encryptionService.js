const crypto = require('crypto');
const { getKeyFromEnv } = require('../config/environment');

class EncryptionService {
  constructor() {
    this.key = getKeyFromEnv();
  }

  decryptAES256GCM(encryptedObj) {
    try {
      const iv = Buffer.from(encryptedObj.iv, 'hex');
      const authTag = Buffer.from(encryptedObj.authTag, 'hex');
      const cipherText = Buffer.from(encryptedObj.encrypted, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
      decipher.setAuthTag(authTag);
      
      const decrypted = Buffer.concat([
        decipher.update(cipherText), 
        decipher.final()
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error(`Falha na descriptografia: ${error.message}`);
    }
  }

  parseDecryptedData(plainText) {
    try {
      return JSON.parse(plainText);
    } catch {
      return plainText;
    }
  }
}

module.exports = new EncryptionService();