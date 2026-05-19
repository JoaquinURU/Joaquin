console.log("JavaScript conectado 🚀");

const servicios = [
  {
    id: 1,
    nombre: "Gestión de redes",
    categoria: "Marketing",
    descripcion: "Calendario, estrategia y contenido.",
    detalle: "Ideal para ordenar tu comunicación y publicar con constancia.",
    icono: "📱",
    link: "pages/servicios.html"
  },

  {
    id: 2,
    nombre: "Branding e identidad",
    categoria: "Identidad visual",
    descripcion: "Diseño visual coherente.",
    detalle: "Colores, tipografías y estética para tu marca.",
    icono: "🎨",
    link: "pages/servicios.html"
  },

  {
    id: 3,
    nombre: "Impulso digital",
    categoria: "Estrategia",
    descripcion: "Optimización de perfil y contenido.",
    detalle: "Pensado para marcas que quieren crecer digitalmente.",
    icono: "🚀",
    link: "pages/servicios.html"
  }
];

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

const crearCardServicio = (servicio) => {

  return `

    <article class="card service-card">

      <div class="service-card__icon">
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

      <button
        class="btn btn--outline service-card__button"
        data-id="${servicio.id}"
        type="button"
      >
        Ver detalle
      </button>

    </article>

  `;
};

const actualizarContador = (cantidad) => {

  contadorServicios.textContent =
    `Servicios disponibles: ${cantidad}`;

};

const mostrarServicios = (listaServicios) => {

  contenedorServicios.innerHTML =
    listaServicios
      .map((servicio) => crearCardServicio(servicio))
      .join("");

  actualizarContador(listaServicios.length);

};

mostrarServicios(servicios);

const filtrarPorCategoria = (categoria) => {

  if (categoria === "todos") {
    return servicios;
  }

  return servicios.filter((servicio) => {
    return servicio.categoria === categoria;
  });

};

const buscarServicios = (texto, listaBase) => {

  const busqueda = texto.toLowerCase();

  return listaBase.filter((servicio) => {

    return (
      servicio.nombre.toLowerCase().includes(busqueda)
    );

  });

};

const obtenerCategoriaActiva = () => {

  const botonActivo =
    document.querySelector(".filter-btn.active");

  return botonActivo.dataset.category;

};

const aplicarFiltros = () => {

  const categoriaActiva =
    obtenerCategoriaActiva();

  const textoBuscado =
    buscadorServicios.value;

  const serviciosFiltrados =
    buscarServicios(
      textoBuscado,
      filtrarPorCategoria(categoriaActiva)
    );

  mostrarServicios(serviciosFiltrados);

};

botonesFiltro.forEach((boton) => {

  boton.addEventListener("click", () => {

    botonesFiltro.forEach((btn) => {
      btn.classList.remove("active");
    });

    boton.classList.add("active");

    aplicarFiltros();

  });

});

buscadorServicios.addEventListener("input", () => {

  aplicarFiltros();

});


const buscarServicioPorId = (id) => {

  return servicios.find((servicio) => {
    return servicio.id === Number(id);
  });

};

const mostrarDetalleServicio = (servicio) => {

  detalleTitulo.textContent =
    servicio.nombre;

  detalleCategoria.textContent =
    servicio.categoria;

  detalleDescripcion.textContent =
    servicio.detalle;

  detalleLink.setAttribute(
    "href",
    servicio.link
  );

  detalleServicio.classList.remove("hidden");

};


contenedorServicios.addEventListener("click", (event) => {

  const botonDetalle =
    event.target.closest(".service-card__button");

  if (!botonDetalle) return;

  const idServicio =
    botonDetalle.dataset.id;

  const servicioElegido =
    buscarServicioPorId(idServicio);

  mostrarDetalleServicio(servicioElegido);

});



const recomendaciones = {

  redes:
    "Te recomiendo Gestión de Redes.",

  branding:
    "Te recomiendo Branding e Identidad.",

  impulso:
    "Te recomiendo Impulso Digital."

};

botonesRecomendador.forEach((boton) => {

  boton.addEventListener("click", () => {

    const servicio =
      boton.dataset.service;

    mensajeRecomendador.textContent =
      recomendaciones[servicio];

  });

});

// ===============================
// REDUCE
// ===============================

const totalServicios =
  servicios.reduce((acc) => {

    return acc + 1;

  }, 0);

console.log(totalServicios);