/* ==========================================================================
   07-fichas.js · Ventanas de información (fichas del Cuerpo Académico y de
   cada integrante)
   --------------------------------------------------------------------------
   En index.html, al final del <body>, existe un contenedor #views con una
   <section class="vw" id="v-..."> por ficha. Cualquier enlace con el
   atributo data-view="v-xxxx" abre la ficha cuyo id sea "v-xxxx".

   Ejemplo:  <a href="#v-cano" data-view="v-cano">Dr. Alfredo Cano</a>

   · La ficha abierta se refleja en la URL (#v-cano); el botón "atrás" del
     navegador la cierra.
   · Se cierra con el botón "← Volver" o con la tecla Esc.
   ========================================================================== */
(function () {
  var contenedor = document.getElementById("views");
  if (!contenedor) return;
  var fichas = [].slice.call(contenedor.querySelectorAll(".vw"));

  /* Muestra la ficha con el id indicado (sin tocar la URL) */
  function mostrarFicha(id) {
    // Si el menú superior estaba abierto, se cierra (lo expone 01-barra-superior.js)
    if (window.SMDCV && window.SMDCV.cerrarMenu) window.SMDCV.cerrarMenu();
    fichas.forEach(function (ficha) {
      ficha.classList.toggle("on", ficha.id === id);
    });
    contenedor.classList.add("on");
    contenedor.scrollTop = 0;
    // Mientras la ficha está abierta, la página de fondo no se desplaza
    document.documentElement.style.overflow = "hidden";
  }

  function ocultarFicha() {
    contenedor.classList.remove("on");
    document.documentElement.style.overflow = "";
  }

  /* Abre la ficha y la anota en la URL (#id) */
  function abrirFicha(id) {
    mostrarFicha(id);
    try {
      if (location.hash !== "#" + id) location.hash = id;
    } catch (e) {}
  }

  /* Cierra la ficha y limpia la URL */
  function cerrarFicha() {
    ocultarFicha();
    try {
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {}
  }

  // Botón "atrás" del navegador o enlace directo con #v-xxxx
  addEventListener("hashchange", function () {
    var id = location.hash.slice(1);
    var existe = fichas.some(function (ficha) {
      return ficha.id === id;
    });
    existe ? mostrarFicha(id) : ocultarFicha();
  });

  document.addEventListener("click", function (e) {
    // Cualquier elemento con data-view abre su ficha
    var enlace = e.target.closest("[data-view]");
    if (enlace) {
      e.preventDefault();
      abrirFicha(enlace.dataset.view);
      return;
    }
    // Botón "← Volver" (o cualquier elemento con data-close)
    if (e.target.closest("[data-close],.vback")) {
      e.preventDefault();
      cerrarFicha();
    }
  });

  addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarFicha();
  });
})();
