import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI status endpoint
  app.get('/api/ai-status', (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({ hasApiKey: hasKey });
  });

  // AI consultation for physical education statistics
  app.post('/api/ai-explain', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        return res.status(503).json({
          error: 'Chưa cấu hình GEMINI_API_KEY. Hệ thống đang sử dụng quy tắc phân tích thống kê tích hợp sẵn.',
        });
      }

      const { prompt, analysisType, statsData } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `Bạn là Trợ lý Cố vấn Học tập StatxAI – Chuyên gia Thống kê Thể dục Thể thao và Giáo dục Thể chất.
Nhiệm vụ: Giải thích kết quả thống kê thực tế từ dữ liệu người học vừa nhập.
Nguyên tắc:
1. Giải thích ý nghĩa số liệu trên góc độ thể lực, sinh lý vận động và phương pháp giảng dạy GDTC.
2. Không suy diễn quan hệ nhân quả tuyệt đối nếu dữ liệu không phải thử nghiệm ngẫu nhiên có kiểm soát.
3. Diễn đạt bằng tiếng Việt học thuật, sư phạm, chuẩn xác và dễ hiểu.
4. Trả lời có cấu trúc rõ ràng với các đề mục: Nhận định chính, Ý nghĩa thể lực, Khuyến nghị sư phạm.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nLoại phân tích: ${analysisType || 'Thống kê'}\nDữ liệu phân tích thực tế từ sinh viên:\n${JSON.stringify(statsData, null, 2)}\n\nCâu hỏi/Yêu cầu: ${prompt || 'Hãy diễn giải kết quả thống kê này và cho lời khuyên chuyên môn về hoạt động tập luyện/thể lực.'}`,
              },
            ],
          },
        ],
      });

      return res.json({ text: response.text });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định khi kết nối AI';
      console.error('Error in /api/ai-explain:', err);
      return res.status(500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StatxAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
