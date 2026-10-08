import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API route for AI Health Coach
app.post('/api/ai-coach', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY 가 설정되지 않았습니다.' });
    }

    const { steps, calories, sleepHours, sleepScore, userPrompt, context } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
당신은 스마트 건강 브랜드 'VitalPulse(바이탈펄스)'의 AI 수석 건강 코치입니다.
사용자의 실시간 건강 데이터(걸음 수, 소모 칼로리, 수면 상태 등)를 바탕으로 전문적이고 따뜻한 1:1 건강 분석 및 맞춤 코칭을 제공하세요.

[사용자 오늘 데이터]
- 오늘 걸음 수: ${steps || 8420}보 (목표: 10,000보)
- 소모 칼로리: ${calories || 540} kcal
- 수면 시간: ${sleepHours || '7시간 45분'} (수면 점수: ${sleepScore || 88}점)
- 질문/요청: ${userPrompt || '오늘 내 수면과 활동 데이터 종합 분석을 해줘.'}
${context ? `- 추가 요구사항: ${context}` : ''}

[작성 가이드]
1. 300자 내외로 명확하고 격려하는 어조의 한글 마크다운으로 답변하세요.
2. 당일 활동과 수면 밸런스에 대한 인사이트를 포함하세요.
3. 바로 실행할 수 있는 실천 팁 2~3가지를 추천하세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error('AI Coach Server Error:', err);
    return res.status(500).json({ error: err.message || 'AI 서비스 응답 도중 오류가 발생했습니다.' });
  }
});

// Setup Vite middleware for development or serving built files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VitalPulse Server running on http://0.0.0.0:${PORT}`);
});
