const API_URL = '/.netlify/functions/clientes'; // Tu ruta al backend

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const claveInput = document.getElementById('clave');
const adminPanel = document.getElementById('admin-panel');
const tablaBody = document.getElementById('tabla-clientes');

// Clave de acceso segura (puedes mejorar esto luego)
const CLAVE_SECRETA = 'ruta593admin';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const clave = claveInput.value.trim();
  if (clave === CLAVE_SECRETA) {
    loginForm.style.display = 'none';
    adminPanel.style.display = 'block';
    obtenerClientes();
  } else {
    alert('Clave incorrecta');
  }
});

// Obtener todos los registros
async function obtenerClientes() {
  try {
    const res = await fetch(API_URL);
    const clientes = await res.json();

    tablaBody.innerHTML = '';
    clientes.forEach((cliente) => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td><input value="${cliente.cedula}" data-id="${cliente.id}" data-campo="cedula"></td>
        <td><input value="${cliente.ubicacion}" data-id="${cliente.id}" data-campo="ubicacion"></td>
        <td><input value="${cliente.urbanizacion}" data-id="${cliente.id}" data-campo="urbanizacion"></td>
        <td><input value="${cliente.destino}" data-id="${cliente.id}" data-campo="destino"></td>
        <td><input value="${cliente.mensaje}" data-id="${cliente.id}" data-campo="mensaje"></td>
        <td><input value="${cliente.numero}" data-id="${cliente.id}" data-campo="numero"></td>
        <td>
          <button onclick="guardarCambios('${cliente.id}')">Guardar</button>
          <button onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
  }
}

// Guardar cambios en un cliente
async function guardarCambios(id) {
  const inputs = document.querySelectorAll(`input[data-id="${id}"]`);
  const datos = {};
  inputs.forEach((input) => {
    datos[input.dataset.campo] = input.value.trim();
  });

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const result = await res.json();
    if (res.ok) {
      alert('Cambios guardados correctamente');
    } else {
      alert('Error al guardar cambios: ' + result.error);
    }
  } catch (error) {
    console.error('Error al guardar:', error);
  }
}

// Eliminar un cliente
async function eliminarCliente(id) {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Cliente eliminado');
      obtenerClientes();
    } else {
      const result = await res.json();
      alert('Error al eliminar: ' + result.error);
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}
