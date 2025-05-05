const fs = require('fs').promises;
const pdfService = require('../services/pdfService');
const geminiService = require('../services/geminiService');

const processPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { task } = req.body;
    if (!['summary', 'notes', 'mcqs'].includes(task)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid task specified' });
    }

    const extractedText = await pdfService.extractTextFromPdf(req.file.path);
    const result = await geminiService.generateContent(extractedText, task);
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      task,
      result
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ error: error.message || 'Failed to process PDF' });
  }
};

module.exports = {
  processPdf
};
