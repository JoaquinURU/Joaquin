let servicios = [];
let cotizacion = [];

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

const resumenCotizacion = document.getElementById("resumen-cotizacion");
const totalCotizacion = document.getElementById("total-cotizacion");
const limpiarCotizacionBtn = document.getElementById("limpiar-cotizacion");

const mostrarNotificacion = (texto, tipo = "info") => {
  if (typeof Toastify === "undefined") return;

  let color = "#d7263d";

  if (tipo === "success") {
    color = "#198754";
  }

  if (tipo === "error") {
    color = "#dc3545";
  }

  Toastify({
    text: texto,
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: color,
      borderRadius: "12px",
      fontWeight: "700"
    }
  }).showToast();
};

const cargarServicios = () => {
  fetch("data/servicios.json")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los servicios.");
      }

      return respuesta.json();
    })
    .then((data) => {
      servicios = data;
      mostrarServicios(servicios);
      mostrarNotificacion("Servicios cargados correctamente.", "success");
    })
    .catch(() => {
      mostrarNotificacion("Error al cargar los servicios.", "error");
    })
    .finally(() => {
      actualizarContador(servicios.length);
    });
};

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

      <p class="service-card__price">
        Desde $${servicio.precio}
      </p>

      <div class="service-card__actions">
        <button class="btn btn--outline service-card__button" data-id="${servicio.id}" type="button">
          Ver detalle
        </button>

        <button class="btn btn--primary service-card__quote" data-id="${servicio.id}" type="button">
          Agregar
        </button>
      </div>
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

  if (detalleServicio) {
    detalleServicio.classList.add("hidden");
  }
};

const obtenerServicioAsync = (id) => {
  return new Promise((resolve, reject) => {
    const servicioEncontrado = servicios.find((servicio) => servicio.id === Number(id));

    setTimeout(() => {
      if (servicioEncontrado) {
        resolve(servicioEncontrado);
      } else {
        reject("No se encontró el servicio.");
      }
    }, 900);
  });
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

const mostrarErrorDetalle = (error) => {
  if (!detalleServicio) return;

  detalleTitulo.textContent = "Ocurrió un error";
  detalleCategoria.textContent = "";
  detalleDescripcion.textContent = error;
  detalleLink.setAttribute("href", "#");

  detalleServicio.classList.remove("hidden");
};

const cargarDetalleServicio = (idServicio) => {
  mostrarEstadoCarga();

  obtenerServicioAsync(idServicio)
    .then((servicio) => {
      mostrarDetalleFinal(servicio);
      mostrarNotificacion(`Detalle cargado: ${servicio.nombre}`, "success");
    })
    .catch((error) => {
      mostrarErrorDetalle(error);
      mostrarNotificacion(error, "error");
    })
    .finally(() => {
      // Petición finalizada.
    });
};

const buscarServicioPorId = (id) => {
  return servicios.find((servicio) => servicio.id === Number(id));
};

const agregarACotizacion = (id) => {
  const servicio = buscarServicioPorId(id);

  if (!servicio) return;

  const yaExiste = cotizacion.some((item) => item.id === servicio.id);

  if (yaExiste) {
    mostrarNotificacion("Ese servicio ya fue agregado.", "error");
    return;
  }

  cotizacion.push(servicio);
  renderizarCotizacion();
  mostrarNotificacion(`${servicio.nombre} agregado a la cotización.`, "success");
};

const calcularTotal = () => {
  return cotizacion.reduce((total, servicio) => total + servicio.precio, 0);
};

const renderizarCotizacion = () => {
  if (!resumenCotizacion || !totalCotizacion) return;

  if (cotizacion.length === 0) {
    resumenCotizacion.innerHTML = `
      <p class="muted">Todavía no agregaste servicios.</p>
    `;

    totalCotizacion.textContent = "Total estimado: $0";
    return;
  }

  resumenCotizacion.innerHTML = cotizacion
    .map((servicio) => {
      return `
        <div class="quote-item">
          <span>${servicio.nombre}</span>
          <strong>$${servicio.precio}</strong>
        </div>
      `;
    })
    .join("");

  totalCotizacion.textContent = `Total estimado: $${calcularTotal()}`;
};

const limpiarCotizacion = () => {
  cotizacion = [];
  renderizarCotizacion();
  mostrarNotificacion("Cotización reiniciada.", "success");
};

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

  mostrarNotificacion(`Recomendación: ${recomendacion.nombre}`, "success");
};

if (contenedorServicios) {
  contenedorServicios.addEventListener("click", (event) => {
    const botonDetalle = event.target.closest(".service-card__button");
    const botonCotizar = event.target.closest(".service-card__quote");

    if (botonDetalle) {
      cargarDetalleServicio(botonDetalle.dataset.id);
    }

    if (botonCotizar) {
      agregarACotizacion(botonCotizar.dataset.id);
    }
  });
}

if (botonesFiltro.length > 0) {
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((btn) => btn.classList.remove("active"));
      boton.classList.add("active");
      aplicarFiltros();
      mostrarNotificacion(`Filtro aplicado: ${boton.dataset.category}`, "success");
    });
  });
}

if (buscadorServicios) {
  buscadorServicios.addEventListener("input", () => {
    aplicarFiltros();
  });
}

if (botonesRecomendador.length > 0 && mensajeRecomendador) {
  botonesRecomendador.forEach((boton) => {
    boton.addEventListener("click", () => {
      manejarClickRecomendador(boton);
    });
  });
}

if (limpiarCotizacionBtn) {
  limpiarCotizacionBtn.addEventListener("click", () => {
    limpiarCotizacion();
  });
}

cargarServicios();
renderizarCotizacion();