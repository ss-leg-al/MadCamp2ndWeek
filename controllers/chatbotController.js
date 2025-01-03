require('dotenv').config();
const { OpenAI } = require('openai');

// OpenAI 객체 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getHealthAdvice = async (req, res) => {
    const { question, role } = req.body;
  
    if (!question || !role) {
      return res.status(400).json({ error: 'Question and role are required' });
    }
  
    const systemMessage =
      role === 'trainer'
        ? "You are a professional fitness trainer. Provide detailed advice on exercise, workouts, and physical health.Answer me within 200 characters"
        : "You are a certified nutritionist. Offer professional dietary advice, meal plans, and nutritional guidance.Answer me within 200 characters";
  
    try {
      // OpenAI Chat API 호출
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5', // 또는 'gpt-4
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: question },
        ],
        max_tokens: 150, // 응답의 최대 길이 설정
      });
  
      // 응답 처리
      const answer = response.choices[0]?.message?.content || 'No response from AI.';
      res.status(200).json({ answer });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };