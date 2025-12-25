const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// === ДОБАВЛЕНО: CORS middleware ===
app.use((req, res, next) => {
  // Разрешаем запросы только с вашего домена
  res.header('Access-Control-Allow-Origin', 'https://юристшпагин.рф');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight-запросов (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});
// === КОНЕЦ ДОБАВЛЕНОГО ===

app.post('/api/chat', async (req, res) => {
  try {
    // Удаляем лишние пробелы в URL (это тоже ошибка!)
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', req.body, {
      headers: {
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://юристшпагин.рф', // ← исправлено: был кривой punycode
        'X-Title': 'lawyer-site',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
