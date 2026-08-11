# ROL: Diseñador UI/UX Senior | Especialista en Interacción Neo4j & IA
# OBJETIVO: Diseñar ÚNICAMENTE el componente del Menú Desplegable Interactivo para el control de movimiento del grafo y la ejecución de fórmulas analíticas (Graph Data Science).

## 1. CONTENEDOR PRINCIPAL: MENÚ "GDS & MOVEMENT CONSOLE"
* **Estilo Visual Avanzado:** Desarrolla un panel flotante bajo la estética *Emerald Neuro Glassmorphism*. Utiliza un fondo translúcido con un desenfoque intenso (`backdrop-blur-md` o 24px de blur en Figma) y una opacidad de relleno del 15% en color blanco. Los bordes deben ser ultra-finos (1px) simulando cristal iluminado, utilizando un gradiente lineal que alterne entre cian eléctrico (#00FFFF) y verde esmeralda (#50C878). Añade una sombra paralela difuminada (Drop Shadow: Y=8, Blur=24, Opacidad=10%) para separar el menú del lienzo base.
* **Ubicación Estratégica:** El componente debe estar anclado en la parte superior izquierda del lienzo interactivo, flotando directamente sobre el grafo de nodos, garantizando que no obstruya la visibilidad central de la red.
* **Comportamiento y Micro-interacciones:** Configura el menú en formato de cascada (Dropdown). Al pasar el cursor (Hover), los submenús deben desplegarse utilizando animaciones de "cristal líquido" (Ease-in-out, 300ms), revelando las opciones con un ligero efecto de rebote y un aumento sutil en la luminosidad del borde.
* **Inspector de Propiedades (Desplegable Lateral):** Al hacer clic o seleccionar un nodo en el lienzo, el menú debe expandir una tarjeta de cristal anexa hacia la derecha. Esta tarjeta funcionará como un HUD de datos e incluirá:
  * **Identity:** El ID único del nodo renderizado en tipografía monoespaciada (ej. `<id>: 1204`) para denotar precisión técnica.
  * **Labels:** Clasificación semántica del nodo (ej. `Label: Person` o `Label: Invoice`), destacada dentro de un "pill" o etiqueta con fondo semitransparente.
  * **Properties:** Lista vertical de atributos clave organizados en formato clave-valor (ej. `Name: Alice`, `RiskScore: 0.85`), utilizando pesos tipográficos distintos (Bold para la clave, Regular para el valor).

---

## 2. SECCIÓN DE ALGORITMOS Y FÓRMULAS (Graph Data Science)
Esta sección actúa como el núcleo analítico. Contiene la lista exhaustiva de algoritmos organizados jerárquicamente. Al hacer clic en cualquier opción matemática, debe dispararse una transición fluida que despliegue el "Overlay de Fórmula" superpuesto a la interfaz. Las secciones deben estructurarse estrictamente de la siguiente manera:

* **Desplegable 1: Pathfinding & Search (Búsqueda y Optimización de Rutas)**
  * **Dijkstra Shortest Path:** Acompañado de un icono de trazado directo. (Cálculo de la ruta con menor peso/costo entre dos puntos).
  * **A* (A-Star) Algorithm:** Acompañado de un icono de estrella brillante. (Búsqueda heurística optimizada espacialmente).
  * **Yen's K-Shortest Paths:** Acompañado de un icono de bifurcación. (Cálculo de rutas alternativas y secundarias de contingencia).
  * **Breadth-First Search (BFS) & Depth-First Search (DFS):** (Exploración de red por niveles y profundidad).
  * **Single Source Shortest Path (SSSP):** (Evaluación de distancia desde un nodo raíz hacia toda la red).
* **Desplegable 2: Centrality & Importance (Métricas de Impacto e Influencia)**
  * **Betweenness Centrality:** (Control y detección de cuellos de botella críticos en la transmisión de datos de la red).
  * **PageRank & ArticleRank:** (Medición de relevancia estructural basada en la calidad y cantidad de enlaces entrantes).
  * **Degree Centrality:** (Conteo de conexiones directas absolutas, subdividido visualmente en In-degree / Out-degree).
  * **Closeness Centrality:** (Cálculo de la velocidad de propagación de la información desde un nodo al resto).
* **Desplegable 3: Community Detection (Segmentación y Agrupación)**
  * **Label Propagation Algorithm (LPA):** (Difusión convergente de etiquetas para descubrir clústeres naturales).
  * **Louvain Modularity:** (Detección de comunidades de alta densidad y fuerza relacional).
  * **Weakly Connected Components (WCC):** (Aislamiento y detección de subgrafos desconectados del ecosistema principal).
* **Desplegable 4: Similarity & Link Prediction (Conectividad Predictiva)**
  * **Node Similarity:** (Aplicación de algoritmos de Jaccard y Similitud de Coseno para encontrar perfiles gemelos).
  * **Link Prediction:** (Proyección de nuevas relaciones basadas en Preferential Attachment y conteo de Vecinos Comunes).
* **Desplegable 5: Graph Machine Learning (Modelos Embebidos)**
  * **Node Embedding:** (Técnicas de vectorización como GraphSage / Node2Vec para aprendizaje profundo).
  * **Graph Neural Networks (GNN) Controller:** (Panel de control maestro para redes neuronales de grafos).

---

## 3. OVERLAY DE EXPANSIÓN: VISUALIZADOR DE FÓRMULAS Y LÓGICA
* **Diseño del Overlay:** Cuando el usuario selecciona un algoritmo (por ejemplo, Betweenness Centrality), un panel modular de cristal debe expandirse fluidamente desde el menú lateral hacia el centro. Este overlay debe oscurecer ligeramente el fondo (`dim effect` al 40%) para centrar la atención del usuario en la matemática subyacente.
* **Contenido Visual y Estructura:** El overlay debe estar dividido en dos paneles informativos de alta precisión:
  * **Panel A: Visualizador de Fórmulas Técnicas (Graph Math):** Este espacio está dedicado a la lógica analítica. Debe presentar el diagrama vectorial del algoritmo y la visualización de la fórmula matemática renderizada de forma nítida, utilizando una tipografía estilo serif matemática. 
    *Ejemplo estricto a incluir en el diseño para Centralidad:*
    $$C_B(v) = \sum_{s \neq v \neq t \in V} \frac{\sigma_{st}(v)}{\sigma_{st}}$$
    *Descripción tipográfica en UI:* "Calcula la influencia de un nodo a través del número de caminos más cortos que pasan por él." Para casos como LPA, debe mostrar diagramas explicativos de flujos de convergencia de color en los nodos basados en su vecindario mayoritario.
  * **Panel B: Inspector de Grafo (Property Sidebar):** Un panel adjunto que expone los metadatos exactos extraídos en tiempo real. Debe mostrar los valores en etiquetas de estado (status tags) codificadas por colores: `<id>`, `Labels`, y `Properties` (desglosando `Name`, `Status`, `Risk_Score` con una barra de progreso circular, y `Confidence` en porcentaje).

---

## 4. UBICACIÓN RESTRINGIDA Y ESTADOS DEL COMPONENTE
* **Restricción Absoluta de Lienzo:** ÚNICAMENTE DEBE SER UN MENÚ EN EL DASHBOARD. Debe estar posicionado estrictamente ENCIMA de la capa del dashboard y DEBAJO del título principal. No se debe diseñar el resto del dashboard de fondo; el lienzo de Figma se limitará exclusivamente a este componente modular y sus transiciones.
* **Separador Visual:** Asegúrate de que las divisiones internas entre la sección de "Movimiento" y "Algoritmos GDS" tengan un separador visual claro y elegante: una línea difuminada de 1px de grosor con opacidad del 20%, en color blanco translúcido.
* **Diseño de los 4 Estados Fundamentales:** El entregable debe mostrar frames distintos para:
  * **Cerrado:** El menú en su forma compacta, mostrando solo los iconos principales y ocupando el mínimo espacio.
  * **Hover:** El estado cuando el cursor interactúa con un botón (brillo interno sutil, cambio de cursor, expansión del borde cian).
  * **Desplegado:** La cascada de opciones de algoritmos abierta con su respectivo `backdrop-blur`.
  * **Fórmula Abierta:** El componente en su máxima expansión visualizando el Panel A y el Panel B.

---

## 5. INDICADORES DE CONEXIÓN EN LA BASE DEL MENÚ
Diseña tres indicadores LED sutiles (puntos luminosos o pequeños "pills") integrados en la base estructural del menú. Estos representan la preparación de las conexiones en vivo (Sockets/APIs) para recibir código en la fase de desarrollo:
* **FLUX (Persistencia):** Un puerto visual estilizado que gestiona la inmutabilidad de los flujos. Debe tener un estado luminoso verde esmeralda para indicar la sincronización activa y correcta con el objeto de auditoría `AWU_Ledger__c`.
* **INTENT (Gateway):** Un placeholder gráfico parpadeante en cian eléctrico que representa el middleware de Next.js. Su función visual es canalizar la entrada del `IntentVector` capturado por los comandos de voz del usuario.
* **FORMULA (Cálculo Externo):** Un espacio reservado o nodo luminoso en color magenta/azul cobalto. Representa la conexión lista para enlazar los scripts de cálculo matemático y machine learning externos (ej. Python/Colab) directamente con el renderizado del grafo en la UI de Figma.