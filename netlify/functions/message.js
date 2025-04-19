export async function handler(event, context) {
  try {
    const method = event.httpMethod;
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const rawBody = event.body;

    let parsedBody;

    try {
      parsedBody = JSON.parse(rawBody);
    } catch (e) {
      parsedBody = { error: "No se pudo parsear el cuerpo", rawBody };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        debug: {
          method,
          contentType,
          parsedBody
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Error general en el servidor",
        error: error.message || String(error)
      })
    };
  }
}
