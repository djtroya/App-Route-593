const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { ubicacion, destino } = JSON.parse(event.body);

  const mensaje = `Hola, soy un cliente. Estoy en ${ubicacion} y quiero ir a ${destino}. ¿Hay unidades disponibles?`;

  const apiKey = process.env.OPENAI_API_KEY;

  // Verificamos que la API Key esté definida
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'La API Key no está configurada en las variables de entorno.' })
    };
  }

  try {
    const respuesta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: mensaje }]
      })
    });

    const data = await respuesta.json();

    // Verificamos si la respuesta fue exitosa
    if (!respuesta.ok) {
      console.error('Error de OpenAI:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ respuesta: `Error de OpenAI: ${data.error?.message || 'Respuesta no válida.'}` })
      };
    }

    const respuestaTexto = data.choices?.[0]?.message?.content || 'La IA no devolvió una respuesta válida.';

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: respuestaTexto })
    };
  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ respuesta: 'Error al contactar con la IA.' })
    };
  }
};
