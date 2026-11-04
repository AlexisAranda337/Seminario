/* ==========================================================================
   05-album.js · Carrusel de fotos de la sección "Álbum"
   --------------------------------------------------------------------------
   Estructura HTML (ver <section class="agal"> en index.html):
     .rail            fila horizontal con las fotos (figure.slide)
     .gprev / .gnext  botones anterior / siguiente
     .gdots button    un punto por foto

   Comportamiento:
     · Avanza solo: la animación CSS "gprog" (barra de progreso) avisa con el
       evento "animationend" cuándo pasar a la siguiente foto.
     · Se pausa al pasar el cursor sobre una foto (clase .hold) y cuando la
       sección no está visible (clase .off).
     · Cada foto aparece con un efecto al entrar en pantalla (clase .in).
   ========================================================================== */
(function () {
  var album = document.querySelector(".agal");
  if (!album) return;

  var riel = album.querySelector(".rail");
  var fotos = [].slice.call(riel.children);
  var puntos = [].slice.call(album.querySelectorAll(".gdots button"));
  var actual = 0; // índice de la foto activa
  var temporizador;
  var hayObservador = "IntersectionObserver" in window;

  /* Marca el punto de la foto activa */
  function marcar(indice) {
    actual = indice;
    puntos.forEach(function (punto, j) {
      punto.setAttribute("aria-current", String(j === indice));
    });
  }

  /* Va a una foto (con vuelta al inicio/final) y la centra en el riel */
  function ir(indice) {
    indice = (indice + fotos.length) % fotos.length;
    marcar(indice);
    var foto = fotos[indice];
    riel.scrollTo({
      left: foto.offsetLeft - (riel.clientWidth - foto.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  /* Botones y puntos */
  album.querySelector(".gprev").onclick = function () {
    ir(actual - 1);
  };
  album.querySelector(".gnext").onclick = function () {
    ir(actual + 1);
  };
  puntos.forEach(function (punto, j) {
    punto.onclick = function () {
      ir(j);
    };
  });

  /* Avance automático: la animación CSS "gprog" dura lo que dura cada foto */
  album.addEventListener("animationend", function (e) {
    if (e.animationName === "gprog") ir(actual + 1);
  });

  /* Si la persona desplaza el riel con el dedo o el mouse, se detecta cuál
     foto quedó más cerca del centro para actualizar los puntos */
  riel.addEventListener(
    "scroll",
    function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        var centro = riel.scrollLeft + riel.clientWidth / 2;
        var mejor = 0;
        var distanciaMinima = 1e9;
        fotos.forEach(function (foto, j) {
          var distancia = Math.abs(foto.offsetLeft + foto.offsetWidth / 2 - centro);
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            mejor = j;
          }
        });
        if (mejor !== actual) marcar(mejor);
      }, 120);
    },
    { passive: true }
  );

  /* Efecto de entrada de cada foto (clase .in) */
  if (hayObservador) {
    var observadorFotos = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("in");
            observadorFotos.unobserve(entrada.target);
          }
        });
      },
      { root: null, threshold: 0.2 }
    );
    fotos.forEach(function (foto) {
      observadorFotos.observe(foto);
    });
  } else {
    fotos.forEach(function (foto) {
      foto.classList.add("in");
    });
  }

  /* Pausa el avance automático cuando la sección no está a la vista (.off) */
  album.classList.add("off");
  if (hayObservador) {
    new IntersectionObserver(
      function (entradas) {
        album.classList.toggle("off", !entradas[0].isIntersecting);
      },
      { threshold: 0.3 }
    ).observe(album);
  } else {
    album.classList.remove("off");
  }

  /* Pausa el avance automático mientras el cursor está sobre una foto (.hold) */
  fotos.forEach(function (foto) {
    foto.addEventListener("mouseenter", function () {
      album.classList.add("hold");
    });
    foto.addEventListener("mouseleave", function () {
      album.classList.remove("hold");
    });
  });

  marcar(0);
})();
