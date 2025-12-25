const express = require('express');
const axios = require('axios');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://xn--80agnczifjj4d3c.xn--p1ai');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        ...req.body,
        model: "openchat/openchat-3.5-0106:free"
      },
      {
        headers: {
          'HTTP-Referer': 'https://xn--80agnczifjj4d3c.xn--p1ai',
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
