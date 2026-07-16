const express = require('express');
const router = express.Router();

router.get('/files', (req, res) => {
  res.send('<div>File listing placeholder</div>');
});

module.exports = router;