// Modelo: Maneja el historial de conversación
let history = [];

export function addMessage(role, content) {
  history.push({ role, content });
  if (history.length > 10) {
    history.shift(); // Limita el historial a los últimos 10 mensajes
  }
}

export function getHistory() {
  return history;
}

export function resetHistory() {
  history = [];
}
