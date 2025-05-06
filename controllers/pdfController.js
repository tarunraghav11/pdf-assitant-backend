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

    // 1. Extract full text
    const fullText = await pdfService.extractTextFromPdf(req.file.path);

    // 2. Build a vector store from chunks (embedding-based memory)
    const vectorStore = await geminiService.buildVectorStore(fullText);

    // 3. Use task as a query to retrieve context chunks
    const context = await geminiService.retrieveRelevantChunks(task, vectorStore);

    // 4. Send context + task to Gemini
    const result = await geminiService.generateContent(context, task);

    // 5. Clean up
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
