const express = require('express');
const axios = require('axios');

const app = express();

// CORS — разрешаем запросы только с вашего сайта
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://юристшпагин.рф');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    // Формируем сообщения для Ollama
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

    // Отправляем запрос в локальный Ollama
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
      { timeout: 120000 } // 2 минуты на ответ
    );

    // Форматируем ответ под OpenAI-совместимый формат (как в вашем чате)
    res.json({
      choices: [
        {
          message: {
            content: response.data.message.content.trim()
          }
        }
      ]
    });

  } catch (error) {
    console.error('❌ Ollama error:', error.message || error);
    res.status(500).json({
      error: 'Не удалось получить ответ от юриста. Попробуйте позже.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`✅ Ollama готов к запросам (модель: phi3:mini)`);
});
