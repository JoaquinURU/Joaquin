
console.log("JS listo 🚀");

const botones = document.querySelectorAll(".recommender__btn");
const mensaje = document.getElementById("mensaje-js");


const servicios = {
  redes: {
    nombre: "Gestión de Redes",
    descripcion: "Te ayuda a ordenar ideas, definir pilares y publicar con claridad.",
    link: "pages/servicios.html"
  },
  branding: {
    nombre: "Branding e Identidad",
    descripcion: "Construye una imagen profesional y coherente para tu marca.",
    link: "pages/servicios.html"
  },
  impulso: {
    nombre: "Impulso Digital",
    descripcion: "Optimiza tu perfil, contenido y conversión.",
    link: "pages/servicios.html"
  },
  asesoria: {
    nombre: "Asesoría 1:1",
    descripcion: "Analizamos tu caso y definimos estrategia personalizada.",
    link: "pages/contacto.html"
  }
};

const obtenerServicio = (clave = "redes") => {
  return servicios[clave];
};


const mostrarServicio = (servicio) => {
  if (!mensaje) return;

  mensaje.innerHTML = `
    <strong>${servicio.nombre}</strong><br>
    ${servicio.descripcion}<br><br>
    <a href="${servicio.link}" class="btn btn--primary">Ir</a>
  `;
};

const activarBoton = (botonSeleccionado) => {
  botones.forEach(btn => btn.classList.remove("active"));
  botonSeleccionado.classList.add("active");
};

const manejarClick = (boton) => {
  const clave = boton.dataset.service;
  const servicio = obtenerServicio(clave);

  activarBoton(boton);
  mostrarServicio(servicio);
};

if (botones.length > 0) {
  botones.forEach(boton => {
    boton.addEventListener("click", () => manejarClick(boton));
  });
}

Object.keys(servicios).forEach(clave => {
  console.log("Servicio disponible:", servicios[clave].nombre);
});