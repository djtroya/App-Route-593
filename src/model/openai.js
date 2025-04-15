const fetch = require('node-fetch');

async function getOpenAIResponse(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error('Respuesta inválida del modelo');
  }

  return data.choices[0].message.content;
}

module.exports = { getOpenAIResponse };
