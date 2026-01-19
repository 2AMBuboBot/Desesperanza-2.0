function contieneHTML(texto) {
  const regex = /<[^>]*>/g;
  return regex.test(texto);
}

function soloLetras(texto) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto);
}

function soloNumeros(texto) {
  return /^[0-9]+$/.test(texto);
}
document.addEventListener("DOMContentLoaded", () => {

  const loginCliente = document.getElementById("loginCliente");
  const loginAdmin = document.getElementById("loginAdmin");
  const registerContainer = document.getElementById("registerContainer");

  // Mostrar login admin
  document.getElementById("showAdmin").onclick = () => {
    loginCliente.style.display = "none";
    loginAdmin.style.display = "block";
  };

  // Regresar a login cliente
  document.getElementById("backToCliente").onclick = () => {
    loginAdmin.style.display = "none";
    loginCliente.style.display = "block";
  };

  // Mostrar registro
  document.getElementById("showRegister").onclick = () => {
    loginCliente.style.display = "none";
    registerContainer.style.display = "block";
  };

  // Regresar a login normal
  document.getElementById("backToLogin").onclick = () => {
    registerContainer.style.display = "none";
    loginCliente.style.display = "block";
  };


  // LOGIN CLIENTE
document.getElementById("loginClienteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("clienteUser").value.trim(); 
  const password = document.getElementById("clientePass").value.trim();

  if (!email || !password) return alert("Correo y contraseña son obligatorios");

  try {
    const resp = await fetch("/api/loginCliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await resp.json();
    alert(data.mensaje);

    if (resp.ok) {
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error(err);
    alert("Error al conectarse con el servidor");
  }
});




  // LOGIN ADMIN
  document.getElementById("loginAdmin").addEventListener("submit", async e => {
  e.preventDefault();
  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  const resp = await fetch("/api/loginAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  });

  const data = await resp.json();

  if (resp.ok) {
    alert(`🎉 Bienvenido, ${username}!`); 
    window.location.href = "index.html";
  } else {
    alert(data.mensaje);
  }
});


  // REGISTRO CLIENTE
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("newUsername").value.trim();
  const telefono = document.getElementById("newTelefono").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const direccion = document.getElementById("newDireccion").value.trim();
  const password = document.getElementById("newPassword").value.trim();

  // Obligatorios
  if (!nombre) return alert("El nombre es obligatorio");
  if (!password) return alert("La contraseña es obligatoria");

  // Bloqueo de HTML
  if (contieneHTML(nombre)) return alert("El nombre no puede contener etiquetas");
  if (contieneHTML(password)) return alert("La contraseña no puede contener etiquetas");
  if (email && contieneHTML(email)) return alert("El correo no puede contener etiquetas");
  if (telefono && contieneHTML(telefono)) return alert("El teléfono no puede contener etiquetas");
  if (direccion && contieneHTML(direccion)) return alert("La dirección no puede contener etiquetas");

  // Validaciones de formato
  if (!soloLetras(nombre)) return alert("El nombre solo debe contener letras");

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Correo no válido");
  }

  if (telefono !== "") {
    if (!soloNumeros(telefono)) return alert("El teléfono solo debe contener números");
  }

  try {
    const resp = await fetch("/api/registerCliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        password
      })
    });

    const data = await resp.json();
    alert(data.mensaje);

    if (data.ok && data.redirect) {
      window.location.href = data.redirect;
    }

  } catch (err) {
    console.error(err);
    alert("Error al conectarse con el servidor");
  }
});

});
