document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const chat = document.getElementById("chat");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Mostrar mensaje del usuario
    appendMessage("Tú", userMessage);
    input.value = "";

    try {
      const response = await fetch("https://regal-dango-690672.netlify.app/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensaje: userMessage }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();
      const botMessage = data.respuesta || "Sin respuesta del bot";
      appendMessage("Route 593", botMessage);
    } catch (error) {
      appendMessage("Error", "No se pudo contactar con el servidor.");
      console.error("Error al enviar el mensaje:", error);
    }
  });

  function appendMessage(sender, message) {
    const div = document.createElement("div");
    div.classList.add("mensaje");
    div.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }
});
