const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Olá, rota funcionando!');
});

module.exports = router;