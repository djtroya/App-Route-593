// Vista: Se encarga de la UI
export function renderMessage(role, content) {
  const chatWindow = document.getElementById("chat-window");
  const messageEl = document.createElement("div");
  messageEl.className = `chat-message ${role}`;
  messageEl.innerHTML = `<strong>${role === "user" ? "Usuario" : "Bot"}:</strong> ${content}`;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

export function clearInput() {
  document.getElementById("user-input").value = "";
}
