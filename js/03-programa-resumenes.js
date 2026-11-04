/* ==========================================================================
   03-programa-resumenes.js · Recuadro con el título y el resumen de cada conferencia
   --------------------------------------------------------------------------
   Al hacer clic (o tocar) una conferencia del programa se abre un recuadro
   flotante con el título de la conferencia y su resumen.

   Los textos NO están en el HTML: viven en js/03-programa-datos.js
   (objeto CONFERENCIAS). Cada <li> del programa se enlaza con su texto
   mediante el atributo data-id (fecha en formato AAAA-MM-DD):

     <li data-id="2026-08-07"> ... </li>   <->   CONFERENCIAS["2026-08-07"]

   Cómo se cierra:  otro clic en la misma conferencia, un clic fuera del
   recuadro, la tecla Esc o desplazar la página.
   Teclado:  Tab hasta la conferencia y Enter o Espacio.
   ========================================================================== */
(function () {
  var datos = window.CONFERENCIAS || {};
  var elementos = [].slice.call(document.querySelectorAll(".mcard li[data-id]"));
  if (!elementos.length) return;

  /* El recuadro es un único <div> que se reutiliza para todas las conferencias */
  var recuadro = document.createElement("div");
  recuadro.className = "rtip";
  recuadro.id = "rtip";
  recuadro.setAttribute("role", "tooltip");
  document.body.appendChild(recuadro);

  var actual = null; // <li> cuyo resumen se está mostrando

  /* Escribe el título y los párrafos del resumen en el recuadro */
  function llenar(li) {
    var info = datos[li.dataset.id] || {};
    recuadro.textContent = "";

    var titulo = document.createElement("h4");
    titulo.textContent = info.titulo || "";
    recuadro.appendChild(titulo);

    // Los párrafos del resumen se separan con una línea en blanco
    (info.resumen || "").split(/\n\n/).forEach(function (texto) {
      if (!texto) return;
      var parrafo = document.createElement("p");
      parrafo.textContent = texto;
      recuadro.appendChild(parrafo);
    });
  }

  /* Coloca el recuadro junto a la conferencia, arriba o abajo según haya
     más espacio, sin salirse de la pantalla. */
  function colocar(li) {
    var caja = li.getBoundingClientRect();
    var anchoVentana = innerWidth;
    var altoVentana = innerHeight;
    var margen = 12; // separación mínima con el borde de la pantalla
    var hueco = 8; // separación entre la conferencia y el recuadro

    /* En pantallas muy anchas o muy angostas el sitio usa "zoom" CSS (ver
       00-escala.js). Se mide cuánto escala el navegador las coordenadas (k)
       para colocar el recuadro exactamente donde corresponde. */
    recuadro.style.maxHeight = "";
    recuadro.style.left = "100px";
    recuadro.style.top = "100px";
    var k = recuadro.getBoundingClientRect().left / 100 || 1;

    var ancho = recuadro.getBoundingClientRect().width;
    var altoCompleto = recuadro.getBoundingClientRect().height;
    var espacioAbajo = altoVentana - caja.bottom - hueco - margen;
    var espacioArriba = caja.top - hueco - margen;
    var ponerAbajo = altoCompleto <= espacioAbajo || espacioAbajo >= espacioArriba;
    var espacio = Math.max(120, Math.min(ponerAbajo ? espacioAbajo : espacioArriba, altoVentana * 0.6));

    recuadro.style.maxHeight = espacio / k + "px"; // si es largo, se desplaza dentro
    var alto = Math.min(altoCompleto, espacio);

    // Centrado respecto a la conferencia, pero dentro de la pantalla
    var x = caja.left + caja.width / 2 - ancho / 2;
    x = Math.max(margen, Math.min(x, anchoVentana - ancho - margen));
    var y = ponerAbajo ? caja.bottom + hueco : caja.top - hueco - alto;
    y = Math.max(margen, Math.min(y, altoVentana - alto - margen));

    recuadro.style.left = x / k + "px";
    recuadro.style.top = y / k + "px";
    recuadro.scrollTop = 0;
  }

  function mostrar(li) {
    actual = li;
    llenar(li);
    colocar(li);
    recuadro.classList.add("on");
    elementos.forEach(function (el) {
      el.removeAttribute("aria-describedby");
    });
    li.setAttribute("aria-describedby", "rtip"); // accesibilidad
  }

  function ocultar() {
    actual = null;
    recuadro.classList.remove("on");
    elementos.forEach(function (el) {
      el.removeAttribute("aria-describedby");
    });
  }

  /* Abre el resumen; si ya estaba abierto, lo cierra */
  function alternar(li) {
    actual === li && recuadro.classList.contains("on") ? ocultar() : mostrar(li);
  }

  elementos.forEach(function (li) {
    li.addEventListener("click", function (e) {
      e.stopPropagation(); // evita que el clic cierre el recuadro de inmediato
      alternar(li);
    });
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar(li);
      }
    });
  });

  // Un clic fuera del recuadro lo cierra
  document.addEventListener("click", function (e) {
    if (!recuadro.contains(e.target)) ocultar();
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") ocultar();
  });
  // Al desplazar la página se cierra (salvo que se esté leyendo el recuadro)
  addEventListener(
    "scroll",
    function () {
      if (actual && !recuadro.matches(":hover")) ocultar();
    },
    { passive: true }
  );
  addEventListener("resize", ocultar);
})();
