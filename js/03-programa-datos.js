/* ==========================================================================
   03-programa-datos.js · Título y resumen de cada conferencia
   --------------------------------------------------------------------------
   Esta es la ÚNICA parte que hay que editar para cambiar los resúmenes.

   · La llave ("2026-08-07") es la fecha de la conferencia y debe coincidir
     con el atributo data-id del <li> correspondiente en index.html.
   · "resumen" va entre comillas invertidas (`) y admite varios párrafos:
     basta con dejar una línea en blanco entre ellos.
   · Si una conferencia aún no tiene resumen, déjalo como "" y el recuadro
     mostrará únicamente el título.

   Más adelante, cuando exista una base de datos, este objeto puede
   reemplazarse por una petición al servidor sin tocar 03-programa-resumenes.js.
   ========================================================================== */
window.CONFERENCIAS = {
  "2026-08-07": {
    titulo: `Tecnologías y procesos verdes para la restauración ambiental`,
    resumen: `Con la finalidad de contribuir a la recuperación de los recursos naturales, tal como agua, suelo y aire, se han investigado diversos procesos fisicoquímicos, tal como la adsorción, electroquímicos, procesos avanzados de oxidación y reducción, fitorremediación, entre otros. Los procesos de adsorción se han empleado materiales de bajo costo como los residuos lignocelulósicos para la eliminación de iones tóxicos (iones metálicos Pb(II), Cd(II), Cr(VI), entre otros). Con respecto a los procesos electroquímicos los procesos de electrocoagulación y electro-oxidación se han aplicado en la recuperación de agua residual de diversos giros industriales logrando eliminar más del 80 % de contaminantes en agua y al acoplar procesos, incrementa la eficiencia del tratamiento. Y con la finalidad de eliminar contaminantes en aire se aplicado electro-reducción de CO2 para la generación de productos de valor, tal como el ácido fórmico. Otra aplicación interesante es la electroestimulación en suelos y semillas para facilitar la migración efectiva de iones y materia orgánica para incrementar la velocidad de germinación de diversas especies de interés cultural, tal como el maíz palomero toluqueño.`,
  },

  "2026-08-14": {
    titulo: `Análisis topológico de datos y transporte urbano`,
    resumen: `En esta ponencia se presentarán, en primer lugar, los principales resultados del trabajo de Carmody y Sowers (2021), quienes proponen una metodología para analizar la evolución temporal del ritmo de avance del tráfico mediante encaje por retardo y análisis topológico de datos (TDA por sus siglas en inglés). Entre sus contribuciones más relevantes destacan: (i) demostrar que los diagramas de persistencia permiten distinguir distintos regímenes de tráfico a partir de la estructura topológica de las series temporales de velocidad y (ii) mostrar que la información topológica constituye una herramienta útil para el diseño de la infraestructura vial de una ciudad. Posteriormente, se discutirá cómo estas ideas motivaron el desarrollo de un proyecto de investigación orientado al estudio del sistema de transporte multimodal de la Ciudad de México desde la perspectiva de la ciencia de redes y el TDA. El proyecto contempla la integración de información proveniente de GTFS-estático y registros históricos de los sistemas Metro, Metrobús, Trolebús, Tren Ligero y Cablebus; la construcción de una red compleja multicapa para evaluar la robustez estructural del sistema; la estimación dinámica de la afluencia mediante algoritmos de Iterative Proportional Fitting; el desarrollo de modelos de resiliencia basados en aprendizaje automático para detectar anomalías y predecir fallos en cascada; la caracterización topológica de la estabilidad del tráfico mediante TDA; y, finalmente, la identificación de rutas funcionales que combinen criterios de estabilidad dinámica con las necesidades de movilidad reportadas en la Encuesta Origen-Destino de la Zona Metropolitana del Valle de México.`,
  },

  "2026-08-21": {
    titulo: `¿Qué son las Ciencias ómicas?`,
    resumen: `En esta plática, hablaremos de las ciencias “ómicas” i.e. disciplinas de investigación emergentes que estudian la totalidad de moleculas de un organismo - tales como genes, proteínas y metabolitos - mediante análisis de datos de secuenciación masiva.`,
  },

  "2026-08-28": {
    titulo: `La inestabilidad de Taylor: una inestabilidad intrigante inhibida por un gradiente de temperatura`,
    resumen: "", // (el Excel de origen no incluye resumen para esta conferencia)
  },

  "2026-09-04": {
    titulo: `Compuestos bioactivos de subproductos agroalimentarios incorporados en matrices poliméricas comestibles para la conservación de alimentos`,
    resumen: `La generación de subproductos agroalimentarios constituye un problema ambiental y, al mismo tiempo, una fuente de compuestos bioactivos con potencial para la conservación de alimentos. La conferencia abordará su revalorización mediante la recuperación de componentes antioxidantes y antimicrobianos y su incorporación en matrices poliméricas comestibles. Se analizará cómo la composición de estas matrices influye en sus propiedades fisicoquímicas, de barrera y de liberación, así como en su capacidad para disminuir la oxidación y el deterioro microbiológico de los alimentos. También se presentarán ejemplos de películas y recubrimientos aplicados en sistemas alimentarios, destacando los criterios necesarios para demostrar su eficacia. Finalmente, se discutirán limitaciones relacionadas con la estabilidad de los compuestos activos, su interacción con el alimento, la evaluación sensorial y la validación en condiciones reales de almacenamiento.`,
  },

  "2026-09-11": {
    titulo: `Algunas reflexiones sobre la demostración en Matemáticas: pizarrón vs. computadora.`,
    resumen: `El concepto de prueba en matemáticas ha evolucionado a lo largo de los siglos a partir de las nociones intuitivas de justificación y validación. Muchos aspectos relacionados con las pruebas y su aceptación han formado parte de debates filosóficos y matemáticos desde tiempos inmemoriales, existiendo hoy un consenso en lo que se considera una prueba matemática válida. Hoy en dia los avances en computación han permitido implementar asistentes de prueba con los que se ha logrado desarrollar pruebas de teoremas sofisticados, como el de Feit-Thompson de la teoría de los grupos. El propósito de esta charla es presentar mediante ejemplos sencillos algunas cuestiones acerca de la demostración donde en mi opinión, las pruebas asistidas por computadora juegan un rol relevante. Por ejemplo el asunto de las demostraciones directas o indirectas; el fenómeno de volver a demostrar un mismo resultado o el papel de las pruebas explicativas. La exploración de estos y otros temas relacionados arroja luz a la interrogante de si una prueba obtenida con ayuda de sistemas computacionales (asistentes de prueba o IA) es ya equiparable con una prueba de pizarrón.`,
  },

  "2026-09-18": {
    titulo: `Radiofármacos teranósticos: Ciencia e Innovación en México`,
    resumen: `Los radiofármacos constituyen una de las herramientas más innovadoras de la medicina nuclear moderna para el diagnóstico y tratamiento de diversas enfermedades como el cáncer. En esta conferencia se presentarán los avances recientes en radiofármacos teranósticos. Se abordarán además los retos científicos, tecnológicos y regulatorios asociados a su implementación, destacando la contribución de la investigación nacional en esta área estratégica para la salud.`,
  },

  "2026-09-25": {
    titulo: `Avances recientes sobre la energía oscura`,
    resumen: `En este seminario hablaremos sobre las evidencias que nos hacen suponer la existencia de la energía oscura, la componente material oscura que es responsable de la expansión acelerada del universo en tiempos cosmológicos recientes. Comenzaremos con una exposición general de las hipótesis de la energía oscura y los avances recientes sobre la misma, para continuar con una descripción de las cantidades observables que nos aportan información y el proceso estadístico de la inferencia Bayesiana utilizado para imponer restricciones sobre los parámetros de los modelos. Cerraremos con comentarios generales y las perspectivas futuras sobre el acotamiento a las propiedades de la energía oscura.`,
  },

  "2026-10-02": {
    titulo: `Caracterización jerárquica de tejidos vegetales y residuos agroindustriales: de la estructura a la funcionalidad y valorización`,
    resumen: `Los tejidos vegetales presentan una organización jerárquica compleja, en la que la composición química y la arquitectura estructural, desde la escala macro hasta los niveles micro y nanométricos, influyen sobre sus propiedades fisicoquímicas, mecánicas y funcionales. El uso de las técnicas de microscopia, análisis de imágenes, y métodos fisicoquímicos convencionales permite generar conocimiento para el desarrollo de biomateriales, la recuperación de metabolitos de interés y el diseño de nuevas estrategias de aprovechamiento, contribuyendo a la valorización de recursos biológicos bajo principios de sostenibilidad y economía circular.`,
  },

  "2026-10-09": {
    titulo: `Teoría cualitativa de ecuaciones diferenciales: la geometría de las soluciones`,
    resumen: `¿Es necesario conocer explícitamente una solución para entender una ecuación diferencial? Durante mucho tiempo, resolver una ecuación significaba encontrar una fórmula para sus soluciones. Sin embargo, durante el siglo XIX se hizo evidente que no siempre es posible expresar las soluciones mediante funciones elementales. A finales de ese siglo, Henri Poincaré introdujo una nueva perspectiva para el estudio de las ecuaciones diferenciales, centrada en las propiedades de sus soluciones más que en la búsqueda de fórmulas para ellas. En esta charla hablaremos sobre el origen de esta perspectiva y veremos, a través de algunos ejemplos, cómo el estudio geométrico de las soluciones permite comprender su comportamiento, aun cuando no podamos escribirlas explícitamente.`,
  },

  "2026-10-16": {
    titulo: `Diseñando los alimentos del futuro: nanotecnología, bioactivos y alimentos funcionales`,
    resumen: `La ciencia y tecnología de los alimentos enfrenta el reto de desarrollar alimentos que respondan a las necesidades de una población creciente y, al mismo tiempo, contribuyan a mejorar la salud y la sostenibilidad de los sistemas alimentarios. En esta charla se abordarán algunas tendencias que están transformando el futuro de la alimentación, con especial énfasis en el diseño de alimentos funcionales y el uso de la nanotecnología. Se presentará el potencial de la micro- y nanoencapsulación para proteger compuestos bioactivos, mejorar su estabilidad y biodisponibilidad y favorecer su incorporación en diferentes matrices alimentarias.`,
  },

  "2026-10-23": {
    titulo: `Propiedades de transporte de fluidos diatómicos rígidos mediante simulación molecular: influencia de las interacciones repulsivas`,
    resumen: `Se presenta un estudio de la autodifusión y la conductividad térmica de fluidos compuestos por mancuernas rígidas mediante simulaciones de dinámica molecular. El análisis se centra en el efecto que ejerce el grado de repulsión intermolecular sobre las propiedades dinámicas del sistema. En particular, se examina un modelo de molécula de oxígeno, representada como una molécula diatómica rígida, en el cual se modula el grado de repulsión entre los átomos que constituyen dichas moléculas. El potencial de interacción empleado se deriva de la teoría Approximate Non-Conformal (ANC). Este enfoque permite explorar de manera sistemática la influencia de las interacciones repulsivas en el comportamiento dinámico de fluidos moleculares. Asimismo, los resultados contribuyen a una mejor comprensión de la relación entre la estructura molecular y las propiedades de transporte en sistemas compuestos por partículas no esféricas.`,
  },

  "2026-10-30": {
    titulo: `De la separación a la valorización: tecnologías de membrana para el aprovechamiento de recursos biológicos`,
    resumen: `Las matrices biológicas y agroindustriales constituyen sistemas complejos que contienen componentes de alto valor susceptibles de ser recuperados y transformados en ingredientes, productos y nuevas materias primas. En esta conferencia se presentarán los fundamentos y aplicaciones de las tecnologías de membrana como herramientas de separación selectiva para el fraccionamiento, concentración y recuperación de compuestos de interés. Se abordarán ejemplos de su aplicación en la industria alimentaria y biotecnológica, incluyendo la recuperación de fructanos de agave, proteínas, metabolitos y otros compuestos de valor. Asimismo, se discutirán algunos de los retos asociados con el diseño de membranas, el modelado y escalamiento de los procesos, así como las oportunidades de integración con procesos de fermentación, nuevos materiales y herramientas de simulación. La charla busca mostrar a las tecnologías de membrana como una plataforma transversal capaz de conectar diferentes disciplinas y generar nuevas oportunidades de investigación e innovación.`,
  },

  "2026-11-06": {
    titulo: `La gestión universitaria bajo la lupa matemática`,
    resumen: `¿Por qué algunos estudiantes tardan tanto en terminar la carrera, ciertos profesores acumulan más carga docente y algunos grupos de investigación apenas logran coincidir? Antes de repartir culpas, conviene mirar cómo está organizada la universidad. En esta charla exploraremos cómo algunas herramientas matematicas permiten estudiar problemas cotidianos de gestión académica. A partir de experiencias en la UAM Cuajimalpa, veremos cómo modelar la asignación de cursos, reconocer afinidades docentes, detectar cuellos de botella en los planes de estudio y analizar redes de colaboración científica y veremos cómo decisiones aparentemente pequeñas sobre horarios, oferta de materias o distribución del trabajo pueden generar cambios importantes. Muchas veces, para mejorar la vida universitaria, hay que dejar de pedirle compromiso a todo el mundo y empezar a pedirle coherencia al sistema.`,
  },

  "2026-11-13": {
    titulo: `Del aula a la investigación: Análisis espacial de las cubiertas y usos del terreno en el Estado de México. Una aproximación a diversas escalas espaciales`,
    resumen: `La presente investigación muestra los cambios en la cubierta terrestre a diferentes escalas espaciales (macrorregional, regional y local) del Estado de México. Nuestra investigación denota los complejos procesos sociales, geográficos y ambientales que a menudo se ocultan cuando se utilizan perspectivas a una sola escala y un solo actor. Los datos sobre la cubierta y el uso del terreno de los años 1970 y 2018 se utilizaron como fuente principal para analizar los cambios utilizando sistemas de teledetección e información geográfica. A escala macrorregional, los cambios en el uso del terreno de nuestra entidad federativa denotan una alteración a las condiciones nativas de la vegetación hacia actividades agrícolas – urbanas. A escala regional, el análisis de la propuesta de corredor biológico del Bosque de Agua, denotan una importante preservación de estas áreas producto, principalmente, de la organización social (ejidos y comunidades) y una presión importante a su alrededor tendiente hacia el cambio a usos antrópicos producto de las actividades económicas que se están llevando alrededor de ellas. Finalmente, a escala local, se refleja un análisis de estas realidades que aquejan los asentamientos humanos alrededor de la escala mesorregional: extensión de cultivos de temporal y riego, pero con elementos nativos de la vegetación que ahí existía, evidenciando que, a pesar del cambio, no hay una modificación ambiental aún tan grave como puede ser el llegar a una ciudad plena como la de Toluca o la Ciudad de México. Los análisis interconectados en múltiples escalas revelaron diferentes procesos disruptivos ocultos en una escala y evidentes en otra. Los resultados se discuten considerando su relevancia para abordar marcos transdisciplinarios y aplicados teóricamente.`,
  },

  "2026-11-20": {
    titulo: `Fronteras en Física Hadrónica`,
    resumen: "", // (el Excel de origen no incluye resumen para esta conferencia)
  },

};
