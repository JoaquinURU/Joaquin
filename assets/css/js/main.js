// ===============================
// RED AGENCIA CREATIVA
// DOM + EVENTOS + ASINCRONISMO
// ===============================

console.log("JavaScript conectado correctamente 🚀");

// ===============================
// DATOS: ARRAY DE OBJETOS
// ===============================

const servicios = [
  {
    id: 1,
    nombre: "Gestión de redes",
    categoria: "Marketing",
    descripcion: "Calendario, diseño y estrategia para redes sociales.",
    detalle: "Ideal para marcas que necesitan ordenar su comunicación mensual, publicar con constancia y mantener una estética coherente.",
    icono: "📱",
    link: "pages/servicios.html"
  },
  {
    id: 2,
    nombre: "Branding e identidad",
    categoria: "Identidad visual",
    descripcion: "Diseño visual coherente para que tu marca se vea profesional.",
    detalle: "Recomendado para marcas que necesitan definir colores, tipografías, estilo visual y piezas base para comunicar con claridad.",
    icono: "🎨",
    link: "pages/servicios.html"
  },
  {
    id: 3,
    nombre: "Impulso digital",
    categoria: "Estrategia",
    descripcion: "Optimización de contenido, perfil y conversión.",
    detalle: "Pensado para marcas que ya tienen presencia digital, pero necesitan mejorar su perfil, llamados a la acción y estrategia de contenido.",
    icono: "🚀",
    link: "pages/servicios.html"
  },
  {
    id: 4,
    nombre: "Asesoría personalizada",
    categoria: "Estrategia",
    descripcion: "Sesiones 1:1 para ordenar tu comunicación y definir próximos pasos.",
    detalle: "Una instancia personalizada para revisar tu caso, detectar oportunidades y definir un plan de acción concreto.",
    icono: "💡",
    link: "pages/contacto.html"
  },
  {
    id: 5,
    nombre: "Diseño de piezas",
    categoria: "Identidad visual",
    descripcion: "Piezas gráficas claras, prolijas y alineadas a tu marca.",
    detalle: "Perfecto para marcas que necesitan posts, historias, banners o piezas visuales puntuales con una estética consistente.",
    icono: "🖼️",
    link: "pages/trabajos.html"
  }
];

// ===============================
// SELECTORES DOM
// ===============================

const contenedorServicios = document.getElementById("servicios-dinamicos");
const botonesFiltro = document.querySelectorAll(".filter-btn");
const buscadorServicios = document.getElementById("buscador-servicios");
const contadorServicios = document.getElementById("contador-servicios");

const detalleServicio = document.getElementById("detalle-servicio");
const detalleTitulo = document.getElementById("detalle-titulo");
const detalleCategoria = document.getElementById("detalle-categoria");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleLink = document.getElementById("detalle-link");

const botonesRecomendador = document.querySelectorAll(".recommender__btn");
const mensajeRecomendador = document.getElementById("mensaje-js");

// Variable para poder cancelar cargas anteriores
let temporizadorDetalle = null;

// ===============================
// FUNCIONES: SERVICIOS DINÁMICOS
// ===============================

const crearCardServicio = (servicio) => {
  return `
    <article class="card service-card">
      <div class="service-card__icon" aria-hidden="true">
        ${servicio.icono}
      </div>

      <p class="service-card__category">
        ${servicio.categoria}
      </p>

      <h3>
        ${servicio.nombre}
      </h3>

      <p>
        ${servicio.descripcion}
      </p>

      <button class="btn btn--outline service-card__button" data-id="${servicio.id}" type="button">
        Ver detalle
      </button>
    </article>
  `;
};

const actualizarContador = (cantidad) => {
  if (!contadorServicios) return;

  contadorServicios.textContent = `Servicios disponibles: ${cantidad}`;
};

const mostrarServicios = (listaServicios) => {
  if (!contenedorServicios) return;

  contenedorServicios.innerHTML = listaServicios
    .map((servicio) => crearCardServicio(servicio))
    .join("");

  actualizarContador(listaServicios.length);
};

const filtrarPorCategoria = (categoria) => {
  if (categoria === "todos") {
    return servicios;
  }

  return servicios.filter((servicio) => servicio.categoria === categoria);
};

const buscarServicios = (texto, listaBase) => {
  const busqueda = texto.toLowerCase().trim();

  return listaBase.filter((servicio) => {
    return (
      servicio.nombre.toLowerCase().includes(busqueda) ||
      servicio.descripcion.toLowerCase().includes(busqueda) ||
      servicio.categoria.toLowerCase().includes(busqueda)
    );
  });
};

const obtenerCategoriaActiva = () => {
  const botonActivo = document.querySelector(".filter-btn.active");

  if (!botonActivo) {
    return "todos";
  }

  return botonActivo.dataset.category;
};

const aplicarFiltros = () => {
  const categoriaActiva = obtenerCategoriaActiva();
  const textoBuscado = buscadorServicios ? buscadorServicios.value : "";

  const serviciosPorCategoria = filtrarPorCategoria(categoriaActiva);
  const serviciosFiltrados = buscarServicios(textoBuscado, serviciosPorCategoria);

  mostrarServicios(serviciosFiltrados);
};

// ===============================
// DOM + ASINCRONISMO: DETALLE DE SERVICIO
// ===============================

const buscarServicioPorId = (id) => {
  return servicios.find((servicio) => servicio.id === Number(id));
};

const mostrarEstadoCarga = () => {
  if (!detalleServicio) return;

  detalleTitulo.textContent = "Cargando...";
  detalleCategoria.textContent = "";
  detalleDescripcion.textContent = "Obteniendo información del servicio...";
  detalleLink.setAttribute("href", "#");

  detalleServicio.classList.remove("hidden");
};

const mostrarDetalleFinal = (servicio) => {
  if (!detalleServicio || !servicio) return;

  detalleTitulo.textContent = servicio.nombre;
  detalleCategoria.textContent = servicio.categoria;
  detalleDescripcion.textContent = servicio.detalle;
  detalleLink.setAttribute("href", servicio.link);

  detalleServicio.classList.remove("hidden");
};

const mostrarDetalleServicio = (servicio) => {
  if (!servicio) return;

  // Si había una carga anterior pendiente, la cancelamos
  if (temporizadorDetalle) {
    clearTimeout(temporizadorDetalle);
  }

  // Primero mostramos un estado de carga
  mostrarEstadoCarga();

  // Simulamos una petición asíncrona con setTimeout
  temporizadorDetalle = setTimeout(() => {
    mostrarDetalleFinal(servicio);
  }, 1200);
};

// Delegación de eventos en lista dinámica
if (contenedorServicios) {
  contenedorServicios.addEventListener("click", (event) => {
    const botonDetalle = event.target.closest(".service-card__button");

    if (!botonDetalle) return;

    const idServicio = botonDetalle.dataset.id;
    const servicioElegido = buscarServicioPorId(idServicio);

    mostrarDetalleServicio(servicioElegido);
  });
}

// ===============================
// EVENTOS: FILTROS Y BUSCADOR
// ===============================

if (contenedorServicios) {
  mostrarServicios(servicios);
}

if (botonesFiltro.length > 0) {
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((btn) => btn.classList.remove("active"));
      boton.classList.add("active");

      aplicarFiltros();

      if (detalleServicio) {
        detalleServicio.classList.add("hidden");
      }
    });
  });
}

if (buscadorServicios) {
  buscadorServicios.addEventListener("input", () => {
    aplicarFiltros();

    if (detalleServicio) {
      detalleServicio.classList.add("hidden");
    }
  });
}

// ===============================
// REDUCE: TOTAL DE SERVICIOS
// ===============================

const totalServicios = servicios.reduce((acumulador) => {
  return acumulador + 1;
}, 0);

console.log("Cantidad total de servicios:", totalServicios);

// ===============================
// RECOMENDADOR DE SERVICIOS
// ===============================

const recomendaciones = {
  redes: {
    nombre: "Gestión de redes",
    descripcion: "Te recomiendo empezar por Gestión de Redes: te va a ayudar a ordenar ideas, definir pilares y publicar con más claridad."
  },
  branding: {
    nombre: "Branding e identidad",
    descripcion: "Te recomiendo empezar por Branding e Identidad: es clave para que tu marca se vea consistente y profesional."
  },
  impulso: {
    nombre: "Impulso digital",
    descripcion: "Te recomiendo Impulso Digital: ideal si ya tenés una base, pero querés mejorar perfil, contenido y conversión."
  },
  asesoria: {
    nombre: "Asesoría 1:1",
    descripcion: "Te recomiendo una Asesoría 1:1: analizamos tu caso puntual y definimos el mejor camino para tu marca."
  }
};

const obtenerRecomendacion = (servicio = "redes") => {
  return recomendaciones[servicio] || {
    nombre: "Recomendación",
    descripcion: "Elegí una opción para recibir una recomendación personalizada."
  };
};

const activarBotonRecomendador = (botonSeleccionado) => {
  botonesRecomendador.forEach((boton) => {
    boton.classList.remove("active");
  });

  botonSeleccionado.classList.add("active");
};

const mostrarRecomendacion = (recomendacion) => {
  if (!mensajeRecomendador) return;

  mensajeRecomendador.innerHTML = `
    <strong>${recomendacion.nombre}</strong><br>
    ${recomendacion.descripcion}
  `;
};

const manejarClickRecomendador = (boton) => {
  const servicioElegido = boton.dataset.service;
  const recomendacion = obtenerRecomendacion(servicioElegido);

  activarBotonRecomendador(boton);
  mostrarRecomendacion(recomendacion);
};

if (botonesRecomendador.length > 0 && mensajeRecomendador) {
  botonesRecomendador.forEach((boton) => {
    boton.addEventListener("click", () => {
      manejarClickRecomendador(boton);
    });
  });
}

// ===============================
// ASINCRONISMO: MENSAJE DIFERIDO EN CONSOLA
// ===============================

setTimeout(() => {
  console.log("Sistema de servicios listo para usar 💡");
}, 1000);