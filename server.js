const express = require('express');
const axios = require('axios');

const app = express();

// CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://юристшпагин.рф',
    'https://xn--80agnczifjj4d3c.xn--p1ai'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());

// Проверка, работает ли Ollama
app.get('/health', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    res.json({ status: 'ok', models: response.data.models });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ollama not ready' });
  }
});

app.post('/api/chat', async (req, res) => {
  console.log('✅ Получен запрос от:', req.headers.origin);

  try {
    // Проверяем, доступна ли модель
    const modelCheck = await axios.get('http://localhost:11434/api/tags');
    const modelExists = modelCheck.data.models.some(m => m.name.startsWith('phi3:mini'));
    if (!modelExists) {
      throw new Error('Модель phi3:mini не найдена');
    }

    const messages = [
      {
        role: 'system',
        content: `Вы — практикующий юрист в России. Отвечайте:
1. Только по российскому законодательству.
2. Кратко, по делу, с указанием статей ГК РФ, УК РФ, ТК РФ и т.д.
3. Рекомендуйте конкретные действия.
4. Если вопрос требует анализа документов — предложите консультацию напрямую.`
      },
      ...req.body.messages
    ];

    const response = await axios.post(
      'http://localhost:11434/api/chat',
      {
        model: 'phi3:mini',
        messages: messages,
        stream: false,
        options: {
          temperature: 0.5,
          num_ctx: 2048
        }
      },
      { timeout: 120000 }
    );

    console.log('✅ Ollama вернул ответ');

    res.json({
      choices: [{
        message: {
          content: response.data.message.content.trim()
        }
      }]
    });

  } catch (error) {
    console.error('❌ Ошибка Ollama:', error.message || error);
    res.status(500).json({
      error: 'Не удалось получить ответ от юриста. Попробуйте позже.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`✅ Проверьте здоровье сервиса: https://lawyer-chat-proxy.onrender.com/health`);
});
