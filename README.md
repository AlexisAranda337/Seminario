# Seminario Multidisciplinario de Divulgación Científica de Vanguardia

Sitio web estático de una sola página (HTML + CSS + JavaScript). No necesita
servidor, base de datos ni instalación: basta con subir esta carpeta tal cual.

## Estructura

```
index.html                  Página principal: llama a cada sección como si fuera una función
partes/                     Una sección de la página por archivo:
  01-barra-superior.html      Barra superior y menú desplegable
  02-portada.html             Portada (título, ilustración y cuenta regresiva)
  03-programa.html            Programa del semestre
  04-introduccion.html        Introducción y antecedentes
  05-album.html               Álbum de fotos
  06-pie-de-pagina.html       Pie de página
  07-fichas.html              Fichas de información (ventanas emergentes)
css/
  estilos.css               Todos los estilos (con índice y encabezados por bloque)
js/                         Los números indican a qué sección pertenece cada archivo (00 = toda la página)
  00-cargador.js            Carga cada archivo de partes/ dentro de index.html
  00-escala.js              Ajusta el tamaño de la página según la pantalla
  00-animaciones.js         Efectos de aparición e inclinación de la ilustración
  01-barra-superior.js      Barra superior, menú desplegable y enlaces internos
  02-portada-cuenta-regresiva.js   Tarjeta "Próxima conferencia"
  03-programa-resumenes.js  Recuadro con título y resumen de cada conferencia
  03-programa-datos.js      Títulos y resúmenes (el único archivo que se edita para cambiarlos)
  05-album.js               Carrusel de fotos
  07-fichas.js              Ventanas de información de cada persona
img/                        Logotipos, ilustración, flores y fotos del álbum
descargas/
  Programa-2026B.jpg        Archivo que se descarga desde el menú "Programa"
```

Cada archivo empieza con un comentario que explica qué hace y cómo se conecta
con el resto.

## Cómo funciona la división en partes

En `index.html` cada sección se "llama" con una línea:

```html
<div data-parte="partes/03-programa.html"></div>
```

Al abrir la página, `js/00-cargador.js` descarga esos archivos, los coloca en su
lugar y después carga los scripts. Para cambiar una sección, edita su archivo en
`partes/`; no hace falta ningún programa adicional.

**Importante:** como la página descarga archivos, **debe abrirse desde un
servidor**. Con doble clic en `index.html` aparecerá un aviso en lugar de la
página. Los hostings (GitHub Pages, Netlify, cPanel...) ya son servidores, así
que publicada funciona sin hacer nada especial.

## Cómo probarlo en tu computadora

Elige una de estas opciones:

- **Visual Studio Code:** instala la extensión *Live Server*, haz clic derecho
  en `index.html` y elige *Open with Live Server*.
- **Python** (si lo tienes): en una terminal dentro de la carpeta ejecuta
  `python3 -m http.server 8000` (en Windows: `python -m http.server 8000`) y
  abre <http://localhost:8000>.

## Cómo publicarlo

Sube **todo el contenido de la carpeta** (no solo `index.html`: también `partes/`, `css/`, `js/`, `img/` y `descargas/`) a cualquier
servicio de alojamiento estático. Algunas opciones gratuitas:

- **GitHub Pages**: crea un repositorio, sube los archivos y activa Pages en
  *Settings → Pages*.
- **Netlify** o **Cloudflare Pages**: arrastra la carpeta al panel.
- **Hosting tradicional (cPanel, FTP)**: copia los archivos a `public_html`.
- **Servidor institucional (Apache/Nginx)**: copia la carpeta al directorio web.

Las tipografías se cargan desde Google Fonts, por lo que el visitante necesita
conexión a internet para verlas exactamente igual; sin ella el sitio se ve con
una tipografía del sistema.

## Tareas frecuentes

**Cambiar el resumen o el título de una conferencia**
Edita `js/03-programa-datos.js`. Cada conferencia se identifica por su fecha
(`"2026-08-07"`), que debe coincidir con el `data-id` de su `<li>` en `index.html`.

**Agregar o modificar una conferencia del programa**
En `partes/03-programa.html`, dentro de `<section class="prog" id="programa">`, copia un
`<li data-id="AAAA-MM-DD" tabindex="0">...</li>` y cambia día, ponente e
institución. Agrega su texto en `js/03-programa-datos.js`. La cuenta regresiva
se actualiza sola.

**Cambiar de semestre (por ejemplo, a 2027A)**
1. Actualiza los textos "2026B" en `index.html` y en `partes/` (busca "2026B").
2. En `js/02-portada-cuenta-regresiva.js` cambia `ANIO` y `NOMBRE_PROGRAMA`.
3. Reemplaza `descargas/Programa-2026B.jpg` y el enlace del botón "Programa".
4. Actualiza `js/03-programa-datos.js`.

**Cambiar una foto del álbum**
Reemplaza el archivo en `img/` (`album-1.webp` ... `album-4.webp`) conservando
el nombre, o cambia la ruta en `partes/05-album.html`.

**Cambiar colores**
Las variables de color están al principio de `css/estilos.css`
(`:root` y `[data-pal="pop"]`).

## Nota sobre el CSS

`css/estilos.css` conserva las reglas en capas (base, tema de color, secciones y
ajustes para pantallas pequeñas). El orden importa: no reordenes los bloques
ni borres reglas sin probar el resultado en celular y escritorio.
