/* ==========================================================================
   01-barra-superior.js · Barra superior, menú desplegable y desplazamientos
   --------------------------------------------------------------------------
   Controla:
     1. El menú desplegable ("mega") de la barra: Objetivos, Comité
        Organizador, Cuerpo Académico y Programa.
     2. La altura de la barra (variable CSS --nh) para posicionar el menú.
     3. El estado "scrolled" de la barra al bajar la página.
     4. El modo compacto de la barra en celulares (logo que abre el menú).
     5. Los enlaces internos: flecha de la portada, [data-go] y [data-bar].

   Estructura HTML que utiliza (ver index.html):
     <nav> .bar > a[data-t="obj|com|cap|prog"]   botones de la barra
     #mega > section.panel#obj|#com|#cap|#prog   paneles del menú
     .scrim                                       fondo que cierra el menú
   ========================================================================== */
(function () {
  var nav = document.querySelector("nav");
  var mega = document.getElementById("mega");
  var scrim = document.querySelector(".scrim");
  var botones = [].slice.call(document.querySelectorAll(".bar > a"));
  var panelActual = null; // id del panel abierto (null = menú cerrado)
  var temporizador; // retraso para cerrar el menú al sacar el cursor

  /* Función compartida con 07-fichas.js: otras partes de la página la usan
     para cerrar el menú (por ejemplo, al abrir la ficha de una persona). */
  window.SMDCV = window.SMDCV || {};

  /* ¿El dispositivo tiene cursor real (mouse)? En pantallas táctiles no. */
  function hayMouse() {
    return matchMedia("(hover:hover)").matches;
  }

  /* ---------- 1. Abrir y cerrar el menú ---------- */

  function mostrarPanel(id) {
    clearTimeout(temporizador);
    panelActual = id;
    mega.classList.add("open");
    scrim.classList.add("on");
    // Solo el panel pedido queda visible
    [].forEach.call(mega.children, function (panel) {
      panel.classList.toggle("on", panel.id === id);
    });
    // Accesibilidad: avisa a los lectores de pantalla qué botón está expandido
    botones.forEach(function (boton) {
      boton.setAttribute("aria-expanded", String(boton.dataset.t === id));
    });
  }

  function ocultarMenu() {
    panelActual = null;
    mega.classList.remove("open");
    scrim.classList.remove("on");
    botones.forEach(function (boton) {
      boton.setAttribute("aria-expanded", "false");
    });
  }
  window.SMDCV.cerrarMenu = ocultarMenu;

  botones.forEach(function (boton) {
    // Clic o toque: abre el panel; si ya estaba abierto, lo cierra
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      panelActual === boton.dataset.t ? ocultarMenu() : mostrarPanel(boton.dataset.t);
    });
    // Con mouse, basta con pasar el cursor
    boton.addEventListener("mouseenter", function () {
      if (hayMouse()) mostrarPanel(boton.dataset.t);
    });
  });

  // Al sacar el cursor de la barra, el menú se cierra tras 150 ms
  nav.addEventListener("mouseleave", function () {
    if (hayMouse()) temporizador = setTimeout(ocultarMenu, 150);
  });
  nav.addEventListener("mouseenter", function () {
    clearTimeout(temporizador);
  });

  // Los enlaces vacíos (href="#") del menú no deben mover la página
  mega.addEventListener("click", function (e) {
    var enlace = e.target.closest("a");
    if (enlace && enlace.getAttribute("href") === "#") e.preventDefault();
  });

  scrim.addEventListener("click", ocultarMenu);
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") ocultarMenu();
  });

  /* ---------- 2. Altura de la barra (variable CSS --nh) ---------- */

  function medirBarra() {
    document.documentElement.style.setProperty("--nh", nav.offsetHeight + "px");
  }
  medirBarra();
  addEventListener("resize", medirBarra);
  if (window.ResizeObserver) new ResizeObserver(medirBarra).observe(nav);

  /* ---------- 3. Clase "scrolled" al bajar la página ---------- */

  var pendiente = false; // evita repetir el cálculo en cada evento de scroll

  function actualizarScrolled() {
    pendiente = false;
    var haBajado = (window.pageYOffset || document.documentElement.scrollTop || 0) > 10;
    if (nav.classList.contains("scrolled") !== haBajado) {
      nav.classList.toggle("scrolled", haBajado);
    }
  }
  addEventListener(
    "scroll",
    function () {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizarScrolled);
      }
    },
    { passive: true }
  );
  actualizarScrolled();

  /* ---------- 4. Modo compacto en celulares ----------
     Mientras la portada está a la vista, en pantallas pequeñas la barra
     muestra solo el logo. Al tocarlo se despliegan los botones. Cuando la
     portada sale de pantalla, la barra vuelve a mostrarse completa.      */

  var portada = document.querySelector(".stage");
  var logo = nav.querySelector(".logo");

  if (portada && logo) {
    var pantallaChica = matchMedia(
      "(max-width:600px), (max-height:500px) and (orientation:landscape)"
    );
    var compacta = false;
    var calculoPendiente = false;

    // Devuelve true si la barra debe estar en modo compacto ("off-cover").
    // Usa umbrales distintos (70 / 120 px) al entrar y al salir para que
    // no parpadee cuando la portada está justo en el borde.
    function debeSerCompacta() {
      if (!pantallaChica.matches) return false;
      var finPortada = portada.getBoundingClientRect().bottom;
      compacta = compacta ? finPortada < 120 : finPortada < 70;
      return compacta;
    }

    function actualizarModo() {
      calculoPendiente = false;
      var activar = debeSerCompacta();
      if (nav.classList.contains("off-cover") !== activar) {
        nav.classList.toggle("off-cover", activar);
      }
      if (!activar) nav.classList.remove("open");
    }

    function pedirActualizacion() {
      if (!calculoPendiente) {
        calculoPendiente = true;
        requestAnimationFrame(actualizarModo);
      }
    }
    addEventListener("scroll", pedirActualizacion, { passive: true });
    addEventListener("resize", pedirActualizacion);
    actualizarModo();

    // Cuando la portada sale de pantalla se pausan sus animaciones (ahorra batería)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entradas) {
          document.documentElement.classList.toggle("cov-off", !entradas[0].isIntersecting);
        },
        { threshold: 0 }
      ).observe(portada);
    }

    // El logo se comporta como botón que abre/cierra la barra compacta
    logo.setAttribute("role", "button");
    logo.setAttribute("tabindex", "0");
    logo.setAttribute("aria-label", "Menú");

    function alternarBarraCompacta(e) {
      if (!nav.classList.contains("off-cover")) return;
      e.preventDefault();
      if (nav.classList.contains("open")) {
        // Si hay un panel abierto, se cierra primero
        if (mega.classList.contains("open") && scrim) scrim.click();
        nav.classList.remove("open");
      } else {
        nav.classList.add("open");
      }
    }
    logo.addEventListener("click", alternarBarraCompacta);
    logo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") alternarBarraCompacta(e);
    });

    // Un toque fuera de la barra la vuelve a compactar
    document.addEventListener("click", function (e) {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !document.querySelector(".mega.open")
      ) {
        nav.classList.remove("open");
      }
    });
  }

  /* ---------- 5. Enlaces internos ---------- */

  // Flecha de la portada: baja suavemente al programa
  var flecha = document.querySelector(".cue");
  if (flecha) {
    flecha.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("programa").scrollIntoView({ behavior: "smooth" });
    });
  }

  document.addEventListener("click", function (e) {
    // [data-go="id"]: desplaza suavemente hasta el elemento con ese id (pie de página)
    var destino = e.target.closest("[data-go]");
    if (destino) {
      e.preventDefault();
      var elemento = document.getElementById(destino.dataset.go);
      if (elemento) elemento.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // [data-bar="com|cap|..."]: abre ese panel del menú superior (pie de página)
    var enlaceBarra = e.target.closest("[data-bar]");
    if (enlaceBarra) {
      e.preventDefault();
      var boton = document.querySelector(".bar > a[data-t=" + enlaceBarra.dataset.bar + "]");
      if (nav.classList.contains("off-cover")) nav.classList.add("open");
      if (boton) boton.click();
    }
  });
})();
