const express = require('express');
const router = express.Router();
const decryptController = require('../controllers/decryptController');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', decryptController.healthCheck);

/**
 * @swagger
 * /fetch-and-decrypt:
 *   get:
 *     summary: Fetch encrypted data, decrypt and send to webhook
 *     tags: [Decrypt]
 *     responses:
 *       200:
 *         description: Data successfully decrypted and sent
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-and-decrypt', decryptController.fetchDecryptAndSend);

module.exports = router;