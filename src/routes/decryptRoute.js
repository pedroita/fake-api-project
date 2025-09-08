const express = require('express');
const apiService = require('../services/apiService');

const router = express.Router();

router.get('/fetch-and-decrypt', async (req, res) => {
  try {
    const result = await apiService.processData();
    
    if (!result.success) {
      return res.status(500).json({ 
        status: 'error', 
        message: result.error 
      });
    }
    
    console.log(`✅ ${result.recordsProcessed} registros processados com sucesso`);
    
    res.json({
      status: 'ok',
      enviados: result.recordsProcessed,
      respostaN8N: result.n8nResponse
    });
    
  } catch (error) {
    console.error('❌ Erro no processamento:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

module.exports = router;