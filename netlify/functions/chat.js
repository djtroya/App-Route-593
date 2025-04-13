const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { ubicacion, destino } = JSON.parse(event.body);

  const mensaje = `Hola, soy un cliente. Estoy en ${ubicacion} y quiero ir a ${destino}. ¿Hay unidades disponibles?`;

  const apiKey = process.env.WA_API_KEY; // <- Corrección aquí

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
    const respuestaTexto = data.choices?.[0]?.message?.content || 'La IA no devolvió una respuesta válida.';

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
