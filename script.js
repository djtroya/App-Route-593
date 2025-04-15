document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const form = document.getElementById("formulario");
  const input = document.getElementById("mensaje");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;

    // Mostrar mensaje del usuario
    agregarMensaje("Usuario", texto);
    input.value = "";

    try {
      const respuesta = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto }),
      });

      const datos = await respuesta.json();
      agregarMensaje("Bot", datos.respuesta || "Sin respuesta del servidor");
    } catch (error) {
      agregarMensaje("Bot", "Error al conectar con el servidor");
      console.error(error);
    }
  });

  function agregarMensaje(remitente, texto) {
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje";
    mensaje.innerHTML = `<strong>${remitente}:</strong> ${texto}`;
    chat.appendChild(mensaje);
    chat.scrollTop = chat.scrollHeight;
  }
});
