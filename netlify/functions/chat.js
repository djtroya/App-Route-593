import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: body.messages || [
        { role: 'user', content: 'Hola, ¿en qué puedo ayudarte?' }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify(completion.choices[0].message)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
