const { ChatGPTAPI } = require('chatgpt');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const message = body.message;

    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const res = await api.sendMessage(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: res.text }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ response: 'Hubo un error en el servidor.' }),
    };
  }
};
