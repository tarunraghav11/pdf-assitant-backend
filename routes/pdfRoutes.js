const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pdfController = require('../controllers/pdfController');

router.post('/process', upload.single('pdf'), pdfController.processPdf);

module.exports = router;