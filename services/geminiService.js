const { GoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require('@google/generative-ai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const config = require('../config/config');
const { chunkText } = require('./pdfService.js');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);



// Build vector store from text chunks
async function buildVectorStore(text) {
  const chunks = chunkText(text);
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: config.GEMINI_API_KEY,
    model: 'embedding-001',
  });

  const vectorStore = await MemoryVectorStore.fromTexts(
    chunks,
    chunks.map((_, i) => ({ id: i })),
    embeddings
  );

  return vectorStore;
}

// Get relevant chunks from query
async function retrieveRelevantChunks(query, vectorStore, topK = 4) {
  const results = await vectorStore.similaritySearch(query, topK);
  return results.map(r => r.pageContent).join('\n');
}

// Generate RAG-based output
const generateContent = async (fullText, task) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

    const vectorStore = await buildVectorStore(fullText);
    const context = await retrieveRelevantChunks(task, vectorStore);

    let prompt;
    switch (task) {
      case 'summary':
        prompt = `Summarize the following educational content into 6 to 8 concise bullet points.
Use plain bullets (no symbols). Each point should cover a unique idea.

Context:
${context}`;
        break;

      case 'notes':
        prompt = `You are a study assistant. Extract clear, numbered notes from the following text.
No bullets, asterisks, or symbols. Just use numbers and sub-points if needed.

Context:
${context}`;
        break;

      case 'mcqs':
        prompt = `Generate 10 multiple-choice questions (MCQs) with 4 options each using this content.

Each should be formatted like:
Q1. Question text
A. Option 1
B. Option 2
C. Option 3
D. Option 4
Answer: [Correct option letter]

Context:
${context}`;
        break;

      default:
        throw new Error('Invalid task specified');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content');
  }
};

module.exports = {
  generateContent
};
