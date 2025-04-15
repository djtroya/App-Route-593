import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const { message } = JSON.parse(event.body);
    console.log("Mensaje recibido:", message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // podrías cambiar a 'gpt-3.5-turbo' por ahora para probar
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    console.log("Respuesta recibida:", data);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };

  } catch (error) {
    console.error("Error en el handler:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno: ' + error.message }),
    };
  }
}
