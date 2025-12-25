const express = require('express');
const axios = require('axios');

const app = express();

// CORS middleware — ДОБАВЛЕН В САМОЕ НАЧАЛО
app.use((req, res, next) => {
  // ИСПРАВЛЕНО: используем Punycode для домена
  res.setHeader('Access-Control-Allow-Origin', 'https://xn--80agnczifjj4d3c.xn--p1ai');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Отвечаем на preflight-запрос сразу — без остального кода
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Только после CORS — подключаем JSON-парсер
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'https://xn--80agnczifjj4d3c.xn--p1ai', // ← Punycode
          'X-Title': 'lawyer-site',
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
