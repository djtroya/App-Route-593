const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { ubicacion, destino } = JSON.parse(event.body);

  const mensaje = `Hola, soy un cliente. Estoy en ${ubicacion} y quiero ir a ${destino}. ¿Hay unidades disponibles?`;

  const apiKey = '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'; // <- Aquí pones tu API Key

  try {
    const respuesta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: mensaje }]
      })
    });

    const data = await respuesta.json();
    const respuestaTexto = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: respuestaTexto })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error al contactar con la IA.' })
    };
  }
};
