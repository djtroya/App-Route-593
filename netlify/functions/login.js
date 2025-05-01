exports.handler = async (event) => {
  const { usuario, clave } = JSON.parse(event.body || '{}');

  // Simulación de credenciales válidas (puedes mejorar esto con Supabase luego)
  const USUARIO_VALIDO = 'admin';
  const CLAVE_VALIDA = 'ruta593admin';

  if (usuario === USUARIO_VALIDO && clave === CLAVE_VALIDA) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, redirect: '/admin.html' })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Credenciales incorrectas' })
    };
  }
};
