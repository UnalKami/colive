
// URL base de tu microservicio
const API_BASE = "http://localhost:8000/personal";

// 1) Listar todo el personal
async function listarPersonal() {
  const res = await fetch(`${API_BASE}/?skip=0&limit=50`);
  const data = await res.json();
  console.log("Listado de personal:", data);
}

// 2) Crear nuevo personal
async function crearPersonal() {
  const nuevo = {
    nombre: "Juan",
    apellido: "Pérez",
    rol: "vigilante",
    telefono: "3001234567",
    email: "juan.perez@colive.com",
    estado: "activo"
  };
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevo)
  });
  if (res.status === 201) {
    const creado = await res.json();
    console.log("Personal creado:", creado);
  } else {
    const err = await res.json();
    console.error("Error al crear:", err.detail || err);
  }
}

// 3) Obtener uno por ID
async function obtenerPersonal(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (res.ok) {
    const persona = await res.json();
    console.log("Datos del personal:", persona);
  } else {
    console.warn("No se encontró el personal con id", id);
  }
}

// 4) Actualizar personal
async function actualizarPersonal(id) {
  const cambios = {
    telefono: "3157654321",
    estado: "inactivo"
  };
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cambios)
  });
  if (res.ok) {
    const actualizado = await res.json();
    console.log("Personal actualizado:", actualizado);
  } else {
    const err = await res.json();
    console.error("Error al actualizar:", err.detail || err);
  }
}

// 5) Eliminar personal
async function eliminarPersonal(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE"
  });
  if (res.status === 204) {
    console.log("Se eliminó correctamente el personal con id", id);
  } else {
    const err = await res.json();
    console.error("Error al eliminar:", err.detail || err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Ejemplos de uso:
  listarPersonal();
  // crearPersonal();
  // obtenerPersonal(1);
  // actualizarPersonal(1);
  // eliminarPersonal(1);
});

