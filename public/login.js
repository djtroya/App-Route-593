// /public/js/login.js
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const clave = document.getElementById('clave').value.trim();

  try {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      window.location.href = data.redirect;
    } else {
      alert(data.message || 'Clave incorrecta');
    }
  } catch (err) {
    alert('Error de conexión con el servidor');
    console.error(err);
  }
});
