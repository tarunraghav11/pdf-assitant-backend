const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

console.log("Loaded Gemini Key:", process.env.GEMINI_API_KEY);


const generateContent = async (text, task) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
    
    let prompt;
    switch (task) {
      case 'summary':
        prompt = `Summarize the following educational text into 6 to 8 clear, concise bullet points. 
Do not use asterisks (*), dashes (-), or markdown symbols.
Use plain hyphenless bullet points like:

- Point one
- Point two

Ensure each bullet highlights a distinct idea and stays concise.

Text:\n\n${text}`;
        break;
      case 'notes':
        prompt = `You are a study assistant. Your task is to extract key points from the following educational text and output them as clearly numbered study notes.
Do not use asterisks (*), dashes (-), bullet symbols, or any markdown formatting. Only use numbers like:

1. First point
2. Second point
3. Third point

If there are sub-points, format them as:
1. Main point
   a. Sub-point one
   b. Sub-point two

Here is the text:${text}`;
        break;
      case 'mcqs':
        prompt = `Generate 10 multiple-choice questions (MCQs) with 4 options each based on the following text. Format each question like this:
        Q1. [Question text]
        A. [Option 1]
        B. [Option 2]
        C. [Option 3]
        D. [Option 4]
        Answer: [Correct option letter]
        \n\nText: ${text}`;
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