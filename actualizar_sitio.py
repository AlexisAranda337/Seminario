#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
actualizar_sitio.py · Pasa los datos del Excel a la página web
================================================================================
Los profesores solo editan  datos/Seminario-datos.xlsx  (conferencias, álbum y
ajustes del semestre). Este programa lee ese Excel y reescribe automáticamente:

    partes/03-programa.html      Programa del semestre (tarjetas por mes)
    js/03-programa-datos.js      Títulos y resúmenes de cada conferencia
    partes/05-album.html         Álbum de fotos
    + el nombre del semestre, el año, la hora y el cartel descargable
      (partes/01-barra-superior.html, partes/06-pie-de-pagina.html, index.html,
       js/02-portada-cuenta-regresiva.js)

USO (desde la carpeta del sitio):
    python3 actualizar_sitio.py              actualiza la página
    python3 actualizar_sitio.py --revisar    solo revisa el Excel, no escribe nada

No necesita instalar nada: usa únicamente Python 3.8 o superior. (Opcional: si
está instalada la librería Pillow, las fotos grandes se optimizan solas.)
================================================================================
"""
import html
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from urllib.parse import quote
from datetime import date, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
EXCEL = RAIZ / "datos" / "Seminario-datos.xlsx"
CARPETA_ALBUM = RAIZ / "img" / "album"
CARPETA_WEB = CARPETA_ALBUM / "web"  # fotos optimizadas (se generan solas)

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
# Colores de las tarjetas de mes, en rotación (el segundo lleva la clase "gold")
COLORES_MES = ["#2f5153", "#c19758", "#108378", "#4a6453"]
PESO_FOTO_MAXIMO = 350 * 1024  # fotos más pesadas que esto se optimizan (si hay Pillow)

errores, avisos = [], []


# ============================================================================
# 1. Lectura del Excel (sin librerías externas: un .xlsx es un zip con XML)
# ============================================================================
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def normaliza(texto):
    """'Álbum ' -> 'album' (para reconocer encabezados y hojas sin importar acentos)."""
    t = str(texto or "").strip().lower()
    for a, b in zip("áéíóúüñ", "aeiouun"):
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t)


def columna_a_indice(ref):
    letras = re.match(r"[A-Z]+", ref).group(0)
    n = 0
    for c in letras:
        n = n * 26 + (ord(c) - 64)
    return n - 1


def leer_excel(ruta):
    """Devuelve {nombre_normalizado_de_hoja: [fila, fila, ...]}; cada fila es una lista."""
    with zipfile.ZipFile(ruta) as z:
        textos = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
                textos.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))

        libro = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        destino = {r.get("Id"): r.get("Target") for r in rels}

        hojas = {}
        for hoja in libro.find("m:sheets", NS):
            rid = hoja.get("{%s}id" % NS["r"])
            objetivo = destino[rid].lstrip("/")
            if not objetivo.startswith("xl/"):
                objetivo = "xl/" + objetivo
            filas = []
            for fila in ET.fromstring(z.read(objetivo)).iter("{%s}row" % NS["m"]):
                valores = []
                for c in fila.findall("m:c", NS):
                    i = columna_a_indice(c.get("r"))
                    valores.extend([None] * (i + 1 - len(valores)))
                    tipo = c.get("t")
                    v = c.find("m:v", NS)
                    if tipo == "inlineStr":
                        valor = "".join(t.text or "" for t in c.iter("{%s}t" % NS["m"]))
                    elif v is None or v.text is None:
                        valor = None
                    elif tipo == "s":
                        valor = textos[int(v.text)]
                    elif tipo in ("str", "e"):
                        valor = v.text
                    elif tipo == "b":
                        valor = v.text == "1"
                    else:
                        valor = float(v.text)
                    valores[i] = valor
                filas.append(valores)
            hojas[normaliza(hoja.get("name"))] = filas
        return hojas


def tabla(filas, columnas):
    """Convierte las filas de una hoja en diccionarios usando la fila 1 como encabezado.
    `columnas` = {nombre_interno: [encabezados aceptados]}. Devuelve [(num_fila, dict)]."""
    if not filas:
        return [], list(columnas)
    encabezado = [normaliza(x) for x in filas[0]]
    indice = {}
    for interno, nombres in columnas.items():
        for n in nombres:
            if normaliza(n) in encabezado:
                indice[interno] = encabezado.index(normaliza(n))
                break
    resultado = []
    for num, fila in enumerate(filas[1:], start=2):
        if not any(x not in (None, "") for x in fila):
            continue  # fila vacía
        d = {}
        for interno in columnas:
            i = indice.get(interno)
            d[interno] = fila[i] if i is not None and i < len(fila) else None
        resultado.append((num, d))
    faltan = [c for c in columnas if c not in indice]
    return resultado, faltan


def texto(valor):
    if valor is None:
        return ""
    if isinstance(valor, float) and valor.is_integer():
        return str(int(valor))
    return str(valor).strip()


def a_fecha(valor):
    """Acepta fecha de Excel, 2026-08-07, 07/08/2026 o 7-8-2026."""
    if isinstance(valor, float):  # número de serie de Excel (sistema 1900)
        return date(1899, 12, 30) + timedelta(days=int(valor))
    s = texto(valor)
    m = re.fullmatch(r"(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?", s)
    if m:
        return date(int(m[1]), int(m[2]), int(m[3]))
    m = re.fullmatch(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", s)
    if m:
        return date(int(m[3]), int(m[2]), int(m[1]))
    raise ValueError("no es una fecha válida")


def parrafos(resumen):
    """Cada salto de línea (Alt+Enter en Excel) separa un párrafo."""
    lineas = [x.strip() for x in re.split(r"[\r\n]+", resumen) if x.strip()]
    return "\n\n".join(lineas)


# ============================================================================
# 2. Datos del Excel
# ============================================================================
def cargar_datos():
    if not EXCEL.exists():
        sys.exit("No se encontró %s" % EXCEL)
    try:
        hojas = leer_excel(EXCEL)
    except zipfile.BadZipFile:
        sys.exit("El archivo Excel no se puede leer (¿está abierto o dañado? Ciérralo e intenta de nuevo).")
    except KeyError as e:
        sys.exit("El archivo Excel tiene una estructura inesperada: %s" % e)

    for requerida in ("conferencias", "album", "ajustes"):
        if requerida not in hojas:
            sys.exit("Falta la hoja «%s» en el Excel (no cambies los nombres de las hojas)." % requerida.capitalize())

    # ---- Ajustes (dos columnas: Ajuste | Valor) ----
    ajustes = {}
    for fila in hojas["ajustes"][1:]:
        if len(fila) >= 2 and fila[0]:
            ajustes[normaliza(fila[0])] = texto(fila[1])

    def ajuste(nombre, por_defecto=""):
        """por_defecto=None significa que el ajuste es obligatorio."""
        v = ajustes.get(normaliza(nombre), "")
        if not v and por_defecto is None:
            errores.append("Hoja Ajustes: falta el valor de «%s»." % nombre)
        return v or (por_defecto or "")

    cfg = {
        "semestre": ajuste("Semestre", None),
        "etiqueta": ajuste("Etiqueta superior", "X Aniversario"),
        "lugar": ajuste("Lugar", None),
        "horario": ajuste("Horario", None),
        "hora": ajuste("Hora de inicio", "12"),
        "cartel": ajuste("Cartel (archivo en descargas)", ""),
    }
    if cfg["semestre"] and not re.fullmatch(r"\d{4}[A-Za-z]", cfg["semestre"]):
        errores.append("Hoja Ajustes: el semestre debe verse como 2026B o 2027A.")
    try:
        cfg["hora"] = int(float(cfg["hora"].replace(",", ".")))
        if not 0 <= cfg["hora"] <= 17:
            raise ValueError
    except ValueError:
        errores.append("Hoja Ajustes: «Hora de inicio» debe ser un número entre 0 y 17 (hora de la Ciudad de México, p. ej. 12).")
        cfg["hora"] = 12

    # ---- Conferencias ----
    filas, faltan = tabla(hojas["conferencias"], {
        "fecha": ["Fecha"], "ponente": ["Ponente"], "institucion": ["Institución", "Institucion"],
        "titulo": ["Título", "Titulo"], "resumen": ["Resumen"]})
    if faltan:
        sys.exit("Hoja Conferencias: faltan las columnas %s." % ", ".join(faltan))
    confs, vistas = [], {}
    for num, d in filas:
        try:
            f = a_fecha(d["fecha"])
        except (ValueError, OverflowError):
            errores.append("Conferencias, fila %d: la fecha «%s» %s." % (num, texto(d["fecha"]), "no es válida (usa 2026-08-07 o 07/08/2026)"))
            continue
        if not texto(d["ponente"]):
            errores.append("Conferencias, fila %d: falta el nombre del ponente." % num)
        if f in vistas:
            errores.append("Conferencias, fila %d: la fecha %s ya está en la fila %d." % (num, f.isoformat(), vistas[f]))
        vistas[f] = num
        if f.weekday() != 4:
            avisos.append("Conferencias, fila %d: el %s no es viernes." % (num, f.isoformat()))
        if not texto(d["titulo"]):
            avisos.append("Conferencias, fila %d (%s): sin título; el recuadro del resumen saldrá vacío." % (num, texto(d["ponente"])))
        confs.append({"fecha": f, "ponente": texto(d["ponente"]), "institucion": texto(d["institucion"]),
                      "titulo": texto(d["titulo"]), "resumen": parrafos(texto(d["resumen"]))})
    confs.sort(key=lambda c: c["fecha"])
    if not confs:
        errores.append("La hoja Conferencias no tiene ninguna conferencia.")
    if len({c["fecha"].year for c in confs}) > 1:
        avisos.append("Hay conferencias de más de un año; la cuenta regresiva usa el año de la primera.")

    # ---- Álbum ----
    filas, faltan = tabla(hojas["album"], {"foto": ["Foto", "Archivo"], "descripcion": ["Descripción", "Descripcion"]})
    if faltan:
        sys.exit("Hoja Álbum: faltan las columnas %s." % ", ".join(faltan))
    fotos = []
    for num, d in filas:
        nombre = texto(d["foto"])
        if not nombre:
            continue
        if not (CARPETA_ALBUM / nombre).is_file():
            errores.append("Álbum, fila %d: no existe la foto «%s» en la carpeta img/album/." % (num, nombre))
            continue
        fotos.append({"archivo": nombre, "descripcion": texto(d["descripcion"])})
    usadas = {f["archivo"] for f in fotos}
    for p in sorted(CARPETA_ALBUM.iterdir()) if CARPETA_ALBUM.exists() else []:
        if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp") and p.name not in usadas:
            avisos.append("La foto img/album/%s no está en la hoja Álbum, así que no se muestra." % p.name)
    if cfg["cartel"] and not (RAIZ / "descargas" / cfg["cartel"]).is_file():
        errores.append("Ajustes: el cartel «%s» no existe en la carpeta descargas/." % cfg["cartel"])
    return cfg, confs, fotos


# ============================================================================
# 3. Fotos: optimiza si se puede
# ============================================================================
def ruta_foto_web(nombre):
    """Devuelve la ruta (relativa al sitio) que usará la página para esta foto."""
    origen = CARPETA_ALBUM / nombre
    if origen.suffix.lower() == ".webp" and origen.stat().st_size <= PESO_FOTO_MAXIMO:
        return "img/album/" + nombre
    try:
        from PIL import Image, ImageOps
    except ImportError:
        if origen.stat().st_size > PESO_FOTO_MAXIMO:
            avisos.append("La foto «%s» pesa %d KB: la página cargará lento. Redúcela (≈1600 px de ancho) "
                          "o instala Pillow («pip install pillow») para que se optimice sola." % (nombre, origen.stat().st_size // 1024))
        return "img/album/" + nombre
    destino = CARPETA_WEB / (origen.stem + ".webp")
    if not destino.exists() or destino.stat().st_mtime < origen.stat().st_mtime:
        CARPETA_WEB.mkdir(parents=True, exist_ok=True)
        with Image.open(origen) as im:
            im = ImageOps.exif_transpose(im)  # respeta la orientación de fotos del celular
            im.thumbnail((1600, 1600))
            im.convert("RGB").save(destino, "WEBP", quality=82, method=6)
    return "img/album/web/" + destino.name


# ============================================================================
# 4. Generación de archivos
# ============================================================================
AVISO_GENERADO = ("GENERADO AUTOMÁTICAMENTE por actualizar_sitio.py a partir de datos/Seminario-datos.xlsx.\n"
                  "     No lo edites a mano: tus cambios se perderían la próxima vez. Edita el Excel.")


def esc(s):
    return html.escape(s, quote=False)


def generar_programa(cfg, confs):
    tarjetas = []
    meses = []
    for c in confs:
        if not meses or meses[-1][0] != (c["fecha"].year, c["fecha"].month):
            meses.append(((c["fecha"].year, c["fecha"].month), []))
        meses[-1][1].append(c)
    for i, ((_, mes), lista) in enumerate(meses):
        color = COLORES_MES[i % len(COLORES_MES)]
        clase = "mcard gold" if i % len(COLORES_MES) == 1 else "mcard"
        items = "\n".join(
            '        <li data-id="%s" tabindex="0">\n'
            '          <span class="d">%02d</span>\n'
            '          <div><b>%s</b><small>%s</small></div>\n'
            '        </li>' % (c["fecha"].isoformat(), c["fecha"].day, esc(c["ponente"]), esc(c["institucion"]))
            for c in lista)
        tarjetas.append('    <article class="%s" style="--mc: %s">\n      <h3>%s</h3>\n      <ul>\n%s\n      </ul>\n    </article>'
                        % (clase, color, MESES[mes - 1].capitalize(), items))
    return """<!-- ==========================================================================
  PROGRAMA DEL SEMESTRE
  %s
  ========================================================================== -->
<section class="prog" id="programa">
  <span class="badge">%s</span>
  <h2>Programa %s</h2>
  <p class="sub">
    <strong>Seminario Multidisciplinario</strong> de Divulgación Científica de Vanguardia
    <strong>%s</strong>
  </p>
  <div class="pinfo">
    <span
      ><svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" /></svg
      >%s</span
    ><span
      ><svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" /></svg
      >%s</span
    >
  </div>
  <p class="sub">
    <small><strong>Presiona</strong> la conferencia deseada para ver el resumen</small>
  </p>
  <div class="months">
%s
  </div>
</section>
<!-- Separador decorativo (mitad izquierda de la imagen de flores) -->
<div class="sep sep-l" aria-hidden="true">
</div>
""" % (AVISO_GENERADO, esc(cfg["etiqueta"]), esc(cfg["semestre"]), esc(cfg["semestre"]),
       esc(cfg["lugar"]), esc(cfg["horario"]), "\n".join(tarjetas))


def generar_datos_js(confs):
    cuerpo = []
    for c in confs:
        cuerpo.append('  "%s": {\n    titulo: %s,\n    resumen: %s,\n  },\n'
                      % (c["fecha"].isoformat(), json.dumps(c["titulo"], ensure_ascii=False),
                         json.dumps(c["resumen"], ensure_ascii=False)))
    return """/* ==========================================================================
   03-programa-datos.js · Título y resumen de cada conferencia
   --------------------------------------------------------------------------
   %s

   La llave ("2026-08-07") es la fecha de la conferencia y enlaza con el
   data-id del programa (partes/03-programa.html). Los párrafos del resumen se
   separan con una línea en blanco.
   ========================================================================== */
window.CONFERENCIAS = {
%s};
""" % (AVISO_GENERADO.replace("\n     ", "\n   "), "\n".join(cuerpo))


def generar_album(fotos):
    figuras = []
    for i, f in enumerate(fotos, start=1):
        alt = f["descripcion"] or "Foto de una sesión del seminario"
        figuras.append('    <figure class="slide">\n      <img\n        decoding="async"\n        src="%s"\n        alt="%s"\n      />\n    </figure>'
                       % (quote(ruta_foto_web(f["archivo"])), html.escape(alt, quote=True)))
    # Sin espacios entre botones (igual que el original) para que los puntos queden juntos
    botones = ['<button type="button" aria-label="Foto %d"></button' % i for i in range(1, len(fotos) + 1)]
    puntos = "\n      >".join(botones) + ">"
    return """<!-- ==========================================================================
  ÁLBUM (carrusel de fotos, ver js/05-album.js)
  %s
  ========================================================================== -->
<section class="agal" id="galeria">
  <h2>Álbum</h2>
  <div class="rail">
%s
  </div>
  <div class="gctl">
    <button type="button" class="gbtn gprev" aria-label="Foto anterior">&#8249;</button>
    <div class="gdots">
      %s
    </div>
    <button type="button" class="gbtn gnext" aria-label="Foto siguiente">&#8250;</button>
  </div>
</section>
""" % (AVISO_GENERADO, "\n".join(figuras), puntos)


def parchar_otros(cfg, anio):
    """Nombre del semestre, año, hora y cartel en los demás archivos. Devuelve {ruta: texto_nuevo}."""
    cambios = {}
    js = RAIZ / "js" / "02-portada-cuenta-regresiva.js"
    t = js.read_text(encoding="utf-8")
    viejo = re.search(r'var NOMBRE_PROGRAMA = "([^"]+)"', t).group(1)
    t = re.sub(r"var ANIO = \d+;", "var ANIO = %d;" % anio, t)
    t = re.sub(r"var HORA_UTC = \d+;", "var HORA_UTC = %d;" % (cfg["hora"] + 6), t)  # México: UTC-6
    t = t.replace('var NOMBRE_PROGRAMA = "%s"' % viejo, 'var NOMBRE_PROGRAMA = "%s"' % cfg["semestre"])
    cambios[js] = t

    for ruta in [RAIZ / "index.html", RAIZ / "partes" / "01-barra-superior.html", RAIZ / "partes" / "06-pie-de-pagina.html"]:
        t = ruta.read_text(encoding="utf-8")
        t = re.sub(r"\b%s\b" % re.escape(viejo), cfg["semestre"], t)
        if cfg["cartel"] and ruta.name == "01-barra-superior.html":
            t = re.sub(r'href="descargas/[^"]*" download="[^"]*"',
                       'href="descargas/%s" download="%s"' % (cfg["cartel"], cfg["cartel"]), t)
        cambios[ruta] = t
    return cambios


# ============================================================================
# 5. Programa principal
# ============================================================================
def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    solo_revisar = "--revisar" in sys.argv

    cfg, confs, fotos = cargar_datos()
    for a in avisos:
        print("AVISO:", a)
    if errores:
        print()
        for e in errores:
            print("ERROR:", e)
        sys.exit("\nNo se modificó nada. Corrige el Excel y vuelve a ejecutar.")

    print("Excel correcto: %d conferencias, %d fotos, semestre %s." % (len(confs), len(fotos), cfg["semestre"]))
    if solo_revisar:
        print("(Modo --revisar: no se escribió ningún archivo.)")
        return

    cambios = {
        RAIZ / "partes" / "03-programa.html": generar_programa(cfg, confs),
        RAIZ / "js" / "03-programa-datos.js": generar_datos_js(confs),
        RAIZ / "partes" / "05-album.html": generar_album(fotos),
    }
    cambios.update(parchar_otros(cfg, confs[0]["fecha"].year))

    for ruta, nuevo in cambios.items():
        if not ruta.exists() or ruta.read_text(encoding="utf-8") != nuevo:
            ruta.write_text(nuevo, encoding="utf-8", newline="\n")
            print("  actualizado:", ruta.relative_to(RAIZ))
    print("Listo. Recarga la página en el navegador (Ctrl+F5).")


if __name__ == "__main__":
    main()
