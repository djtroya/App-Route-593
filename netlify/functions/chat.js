// netlify/functions/chat.js

const { getOpenAIResponse } = require('../../src/model/openai');

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);

    const reply = await getOpenAIResponse(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Controlador - Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
