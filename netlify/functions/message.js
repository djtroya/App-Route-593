export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    const { app, sender, message, group_name, phone } = data;

    // Lógica de respuesta básica (personaliza como quieras)
    let respuesta = `Hola ${sender}, recibimos tu mensaje: "${message}". ¡Gracias por usar Route 593!`;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: respuesta }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Hubo un error procesando el mensaje." }),
    };
  }
}
