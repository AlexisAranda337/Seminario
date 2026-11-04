/* ==========================================================================
   00-cargador.js · Carga cada sección de la página desde su propio archivo HTML
   --------------------------------------------------------------------------
   Idea: cada sección (carpeta partes/) funciona como una "función" que el
   index.html llama. En index.html cada llamada es una línea como:

       <div data-parte="partes/03-programa.html"></div>

   Este archivo:
     1. Descarga todas las partes (en paralelo).
     2. Reemplaza cada <div data-parte="..."> por el contenido de su archivo,
        respetando el orden. No deja contenedores extra, así que el HTML final
        es el mismo que si todo estuviera escrito en un solo archivo.
     3. Cuando todo está en la página, carga los scripts que necesitan esos
        elementos (01-barra-superior.js, 07-fichas.js, ...), uno tras otro y en orden.

   Uso (al final de index.html):
       cargarPagina(["js/01-barra-superior.js", "js/07-fichas.js"]);

   IMPORTANTE: los navegadores solo permiten descargar archivos cuando la
   página se sirve desde un servidor (hosting, Live Server, python -m
   http.server...). Si se abre con doble clic (file://) se mostrará un aviso.
   ========================================================================== */
(function () {
  var raiz = document.documentElement;

  /* "Llama" a una parte: devuelve una promesa con su HTML en texto */
  function cargarParte(ruta) {
    return fetch(ruta).then(function (respuesta) {
      if (!respuesta.ok) throw new Error("No se pudo cargar " + ruta + " (" + respuesta.status + ")");
      return respuesta.text();
    });
  }

  /* Sustituye el marcador por el contenido de la parte */
  function montar(marcador, html) {
    var molde = document.createElement("template");
    molde.innerHTML = html;
    marcador.replaceWith(molde.content);
  }

  /* Carga un script y espera a que termine (para respetar el orden) */
  function cargarScript(ruta) {
    return new Promise(function (listo, fallo) {
      var script = document.createElement("script");
      script.src = ruta;
      script.async = false;
      script.onload = listo;
      script.onerror = function () {
        fallo(new Error("No se pudo cargar " + ruta));
      };
      document.body.appendChild(script);
    });
  }

  /* Aviso visible cuando algo falla (por ejemplo, al abrir con doble clic) */
  function mostrarAviso(error) {
    var aviso = document.createElement("div");
    aviso.setAttribute("role", "alert");
    aviso.style.cssText =
      "max-width:620px;margin:40px auto;padding:20px 24px;font:16px/1.5 system-ui,sans-serif;" +
      "background:#fff8e6;border:1px solid #c19758;border-radius:10px;color:#1a1a1a";
    aviso.innerHTML =
      "<strong>No se pudo cargar la página.</strong><br>" +
      "Esta página se compone de varios archivos y debe abrirse desde un servidor " +
      "(no con doble clic).<br>Prueba con <code>python3 -m http.server 8000</code> y abre " +
      "<code>http://localhost:8000</code>, o con la extensión Live Server de VS Code.<br>" +
      "<small>Detalle técnico: " + error.message + "</small>";
    document.body.prepend(aviso);
  }

  /* Función principal: monta todas las partes y después carga los scripts */
  window.cargarPagina = function (scripts) {
    var marcadores = [].slice.call(document.querySelectorAll("[data-parte]"));

    Promise.all(
      marcadores.map(function (marcador) {
        return cargarParte(marcador.dataset.parte);
      })
    )
      .then(function (textos) {
        // Ya se descargó todo: se montan en el orden en que están en index.html
        marcadores.forEach(function (marcador, i) {
          montar(marcador, textos[i]);
        });
        // Los scripts se cargan en cadena, uno después del otro
        return (scripts || []).reduce(function (cadena, ruta) {
          return cadena.then(function () {
            return cargarScript(ruta);
          });
        }, Promise.resolve());
      })
      .catch(mostrarAviso)
      .then(function () {
        raiz.classList.remove("cargando"); // muestra la página
      });
  };
})();
