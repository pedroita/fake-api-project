const crypto = require('crypto');
const { aesKey } = require('../config/environment');

function getKey() {
  if (!aesKey) throw new Error('AES_KEY não configurada no .env');
  if (/^[0-9a-fA-F]{64}$/.test(aesKey)) return Buffer.from(aesKey, 'hex');
  return Buffer.from(aesKey, 'base64');
}

function decryptAES256GCM(encryptedObj) {
  const key = getKey();
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const authTag = Buffer.from(encryptedObj.authTag, 'hex');
  const cipherText = Buffer.from(encryptedObj.encrypted, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('utf8');
}

function parseDecryptedData(plain) {
  try {
    return JSON.parse(plain);
  } catch {
    return plain;
  }
}

module.exports = { decryptAES256GCM, parseDecryptedData };
