const crypto = require('crypto');

const decryptAES256GCM = (encryptedObj, key) => {
  try {
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const authTag = Buffer.from(encryptedObj.authTag, 'hex');
    const cipherText = Buffer.from(encryptedObj.encrypted, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([
      decipher.update(cipherText), 
      decipher.final()
    ]).toString('utf8');
  } catch (error) {
    throw new Error(`Falha na descriptografia: ${error.message}`);
  }
};

module.exports = { decryptAES256GCM };