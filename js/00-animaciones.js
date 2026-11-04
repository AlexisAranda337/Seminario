/* ==========================================================================
   00-animaciones.js · Efectos de movimiento de la página
   --------------------------------------------------------------------------
   1. Inclinación suave de la ilustración de la portada al mover el cursor.
   2. Aparición escalonada ("fade-in") de los bloques al hacerse visibles.
   3. Entrada de las tarjetas de los meses en el programa.

   Todos respetan la preferencia del sistema "reducir movimiento"
   (prefers-reduced-motion): si el usuario la activó, no se anima nada.
   ========================================================================== */
(function () {
  var sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hayObservador = "IntersectionObserver" in window;

  /* ---------- 1. Inclinación de la ilustración con el cursor ---------- */
  var ilustracion = document.querySelector(".art");
  if (ilustracion && matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    addEventListener("pointermove", function (e) {
      // Posición del cursor respecto al centro de la pantalla: de -0.5 a 0.5
      var x = e.clientX / innerWidth - 0.5;
      var y = e.clientY / innerHeight - 0.5;
      ilustracion.style.transform =
        "perspective(900px) rotateY(" + x * 6 + "deg) rotateX(" + -y * 4 + "deg)";
    });
  }

  /* ---------- 2. Aparición escalonada de los bloques ----------
     Los elementos de este selector arrancan ocultos (clase .ap) y se
     muestran de uno en uno (clase .ap-in) cuando entran a la pantalla.
     Los estilos están en css/estilos.css, bloque ".js-ap .ap".          */
  if (hayObservador && !sinMovimiento) {
    var selector =
      ".stage .art,.stage .chip,.prog .badge,.prog h2,.prog .sub,.prog .pinfo," +
      ".info .when,.info h2,.info>.lead,.info .pills,.info .step,.sup .lead," +
      ".info .tile,.info .dark,.agal h2,.agal .gwrap,.agal .gdots," +
      "footer .fcol,footer>*>*";

    // Se excluye lo que está dentro de fichas, menús y barra
    var elementos = [].slice
      .call(document.querySelectorAll(selector))
      .filter(function (el) {
        return !el.closest(".vw,.panel,nav");
      });

    if (elementos.length) {
      document.documentElement.classList.add("js-ap");
      elementos.forEach(function (el) {
        el.classList.add("ap");
      });

      // Las tarjetas de los meses entran con un retraso creciente
      [].slice.call(document.querySelectorAll(".mcard")).forEach(function (tarjeta, i) {
        tarjeta.style.transitionDelay = i * 0.16 + "s";
      });

      var observador = new IntersectionObserver(
        function (entradas) {
          var orden = 0;
          entradas
            .filter(function (e) {
              return e.isIntersecting;
            })
            // Primero los que están más arriba en el documento
            .sort(function (a, b) {
              return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
            })
            .forEach(function (entrada) {
              var el = entrada.target;
              observador.unobserve(el);
              // Cada elemento aparece 130 ms después del anterior
              setTimeout(function () {
                el.classList.add("ap-in");
                // Al terminar la transición se limpian las clases auxiliares
                setTimeout(function () {
                  el.classList.remove("ap", "ap-in");
                }, 1500);
              }, orden * 130);
              orden++;
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
      );
      elementos.forEach(function (el) {
        observador.observe(el);
      });
    }
  }

  /* ---------- 3. Tarjetas de los meses (.mcard) ----------
     Cada tarjeta recibe la clase .rv (oculta) y .in (visible) al
     entrar a la pantalla. Las impares llevan un pequeño retraso.        */
  var tarjetas = [].slice.call(document.querySelectorAll(".mcard"));
  if (tarjetas.length && hayObservador && !sinMovimiento) {
    var observadorTarjetas = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var el = entrada.target;
          el.classList.add("in");
          observadorTarjetas.unobserve(el);
          setTimeout(function () {
            el.style.transitionDelay = "";
          }, 1200);
        });
      },
      { threshold: 0.15 }
    );
    tarjetas.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = (i % 2) * 0.12 + "s";
      observadorTarjetas.observe(el);
    });
  }
})();
