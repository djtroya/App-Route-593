const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sin respuesta.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('Error en la función:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error interno del servidor.' })
    };
  }
};
