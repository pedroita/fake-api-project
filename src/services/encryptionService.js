const crypto = require('crypto');
const { aesKey } = require('../config/environment');

function getKey() {
  if (!aesKey) throw new Error('AES_KEY não configurada no .env');
  const keyBuf = Buffer.from(aesKey, 'hex');
  if (keyBuf.length !== 32) {
    throw new Error(`AES_KEY inválida: esperado 32 bytes (64 hex chars), recebido ${keyBuf.length} bytes`);
  }
  return keyBuf;
}

function decryptAES256GCM(encryptedObj) {
  const key = getKey();
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const authTag = Buffer.from(encryptedObj.authTag, 'hex');
  const cipherText = Buffer.from(encryptedObj.encrypted, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

function parseDecryptedData(plain) {
  try {
    return JSON.parse(plain);
  } catch {
    return plain;
  }
}

module.exports = { decryptAES256GCM, parseDecryptedData };
