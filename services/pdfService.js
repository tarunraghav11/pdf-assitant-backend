const { PDFDocument } = require('pdf-lib');
const pdf = require('pdf-parse');
const fs = require('fs').promises;

const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

const getPageCount = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(dataBuffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error('Error getting page count:', error);
    throw new Error('Failed to get PDF page count');
  }
};

function chunkText(text, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  extractTextFromPdf,
  getPageCount,
  chunkText // exported for use in generateContent
};
