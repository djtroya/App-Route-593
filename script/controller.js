// Controlador: Conecta modelo y vista
import { addMessage, getHistory } from './chatModel.js';
import { renderMessage, clearInput } from './chatView.js';

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("user-input");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  renderMessage("user", userMessage);
  clearInput();

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: getHistory() }),
    });

    const data = await response.json();
    const botMessage = data.respuesta;
    addMessage("assistant", botMessage);
    renderMessage("bot", botMessage);
  } catch (error) {
    renderMessage("bot", "Ocurrió un error al conectar con el servidor.");
  }
});
