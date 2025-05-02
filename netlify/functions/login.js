// /netlify/functions/login.js

exports.handler = async (event) => {
  const { usuario, clave } = JSON.parse(event.body || '{}');

  const USUARIO_VALIDO = process.env.ADMIN_USER;
  const CLAVE_VALIDA = process.env.ADMIN_PASSWORD;

  if (usuario === USUARIO_VALIDO && clave === CLAVE_VALIDA) {
    // Simulación de token (puedes usar JWT después)
    const token = 'token_simulado_route593';

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
        redirect: '/admin.html'
      })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: 'Credenciales incorrectas'
      })
    };
  }
};
