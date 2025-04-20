const procesarMensaje = async (data) => {
  console.log('Datos recibidos sin procesar:', JSON.stringify(data));

  // Solo para pruebas, devolvemos el contenido sin guardar aún
  return {
    status: 'debug',
    datos: data
  };
};
