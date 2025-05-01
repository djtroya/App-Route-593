// /public/js/login.js
const loginForm = document.getElementById('login-form');
const claveInput = document.getElementById('clave');
const CLAVE_SECRETA = 'ruta593admin'; // Clave de acceso para el login

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const clave = claveInput.value.trim();
  
  if (clave === CLAVE_SECRETA) {
    // Si la clave es correcta, redirigimos al admin
    window.location.href = '/public/views/admin.html'; 
  } else {
    alert('Clave incorrecta');
  }
});
