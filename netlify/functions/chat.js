const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error response from OpenAI:', errorDetails);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error desde OpenAI', details: errorDetails }),
      };
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No hubo respuesta';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error en el servidor', details: error.message }),
    };
  }
};
