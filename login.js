// /login.js
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value.trim();

  try {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem('authToken', data.token); // Guardamos el token
      window.location.href = data.redirect;
    } else {
      alert(data.message || 'Credenciales incorrectas');
    }
  } catch (err) {
    alert('Error de conexión con el servidor');
    console.error(err);
  }
});
