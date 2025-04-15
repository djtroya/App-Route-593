const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.mensaje;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o", // o "gpt-3.5-turbo" si no tienes acceso
      messages: [{ role: "user", content: userMessage }],
    });

    const respuesta = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta }),
    };
  } catch (error) {
    console.error("Error en función chat:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error procesando la solicitud" }),
    };
  }
};
