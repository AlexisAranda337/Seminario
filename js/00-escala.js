/* ==========================================================================
   00-escala.js · Escala automática de la página según el ancho de la pantalla
   --------------------------------------------------------------------------
   Calcula dos variables CSS que usa el diseño para agrandar el sitio en
   pantallas muy anchas (monitores grandes) y ajustarlo en celulares:

     --z  factor de zoom general (1 = tamaño normal)
     --s  factor de escala de la ilustración de la portada (0.7 a 1)

   Se carga en el <head> (sin "defer") para que el tamaño correcto exista
   desde el primer pintado y la página no "salte" al cargar.
   ========================================================================== */
(function () {
  var raiz = document.documentElement;

  function calcularEscala() {
    var ancho = innerWidth;
    var zoom = 1;

    if (ancho >= 1400) {
      // Pantallas grandes: crece de forma proporcional hasta un máximo de 1.75
      zoom = Math.min(1.75, ancho / 1400);
    } else if (ancho < 600) {
      // Celulares: se ajusta tomando como referencia una pantalla de 390 px
      zoom = Math.max(0.88, Math.min(1.15, ancho / 390));
    }

    // La ilustración nunca baja de 0.7 ni sube de 1
    var escalaIlustracion = Math.min(1, Math.max(0.7, (ancho / zoom - 32) / 560));

    raiz.style.setProperty("--z", zoom.toFixed(3));
    raiz.style.setProperty("--s", escalaIlustracion.toFixed(3));
  }

  calcularEscala();
  addEventListener("resize", calcularEscala);
  addEventListener("orientationchange", calcularEscala);
})();
