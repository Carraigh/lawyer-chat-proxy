const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', req.body, {
      headers: {
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://xn--80agnczifjj4d3c.xn--p1ai',
        'X-Title': 'lawer-site',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
