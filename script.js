const form = document.getElementById("formulario");
const input = document.getElementById("mensaje");
const chat = document.getElementById("chat");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  mostrarMensaje("Tú", texto);
  input.value = "";

  try {
    const respuesta = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mensaje: texto }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const data = await respuesta.json();
    mostrarMensaje("Bot", data.respuesta || "Sin respuesta.");
  } catch (err) {
    console.error(err);
    mostrarMensaje("Bot", "Error al conectar con el servidor.");
  }
});

function mostrarMensaje(remitente, mensaje) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${remitente}:</strong> ${mensaje}`;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}
