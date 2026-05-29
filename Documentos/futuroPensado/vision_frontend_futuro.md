# Visión a futuro del frontend de mediCampo

## Sobre este documento

Esto es una bitácora personal, es decir una visión y no un compromiso, pensada para ordenar hacia dónde podría evolucionar la cara visible de mediCampo, de modo que cuando quiera retomar el tema tenga el criterio ya escrito y no tenga que reconstruirlo de memoria, además conviene leerlo sabiendo que nada de lo que aquí aparece obliga a ejecutarse mañana, sino que se trata de un mapa de posibilidades ordenadas por sensatez, abierto a revisión a medida que el proyecto madure, cambien las prioridades, o aparezcan herramientas nuevas que hoy ni siquiera están sobre la mesa.

El punto de partida es el frontend actual, que vive sobre React 18, Vite 5, TypeScript, TailwindCSS 3, react-router para la navegación, y LiveKit para el video en tiempo real, todo empaquetado como una aplicación de página única, con un plan de convertirla en PWA ya iniciado, desplegada en DigitalOcean detrás de Caddy y con DuckDNS, y atendiendo un caso de uso muy concreto, que es la telemedicina rural, con todo lo que eso implica en cuanto a conexiones inestables, dispositivos modestos, y usuarios que no necesariamente son expertos digitales.

## Diagnóstico honesto de lo que hay hoy

Antes de mirar herramientas nuevas conviene ser franco con el estado presente, porque elegir bien depende de entender qué duele de verdad, y la app actual tiene virtudes que no hay que despreciar, partiendo por Vite, que entrega un entorno de desarrollo veloz y un empaquetado moderno, siguiendo por Tailwind, que ya impone cierta disciplina de estilos y evita el caos del CSS suelto, y rematando con una SPA que funciona, con autenticación operativa, dashboards diferenciados por rol, y una videollamada con LiveKit que efectivamente conecta audio y video, lo cual no es poca cosa.

Ahora bien, hay debilidades igual de reales, y la primera salta a la vista, porque la estética actual sabe a interfaz generada por inteligencia artificial, esto es, correcta pero genérica, con gradientes, bordes redondeados y emojis que se repiten sin una identidad propia que diga mediCampo y no cualquier otra plantilla, y debajo de esa superficie falta un sistema de diseño formal, entendido como un conjunto coherente de tokens de color, tipografía, espaciado y componentes reutilizables, de manera que hoy cada pantalla reinventa un poco la rueda y la consistencia se sostiene más por copiar y pegar clases que por una fuente única de verdad.

A eso se suman cuestiones más estructurales, como que al ser una SPA pura el renderizado ocurre todo en el navegador, lo que penaliza el primer pintado y deja la indexación y el SEO en desventaja frente a un enfoque con renderizado en servidor, mientras que en el plano del código el consumo de datos se hace con fetch manual repartido por los componentes, sin una capa que centralice caché, reintentos y estados de carga, y la persistencia se resuelve a mano con localStorage suelto, tal como se hizo con el chat, que cumple pero no escala como patrón, agregando además que no existe una suite de pruebas ni un catálogo de componentes tipo Storybook, que la accesibilidad está por auditar, y que el peso del bundle nunca se ha medido con herramientas de análisis, por lo que cualquier afirmación sobre rendimiento es, por ahora, una intuición y no un dato.

## Las tres herramientas que tenía en mente

### v0.dev

De las tres, v0.dev es la que mejor encaja con el objetivo de profesionalizar la estética sin dinamitar lo construido, porque es un generador de interfaces asistido por inteligencia artificial, de la gente de Vercel, que produce justamente React con Tailwind y componentes de shadcn/ui, es decir habla el mismo idioma del proyecto, lo que permite tomar lo que genera, adaptarlo, y pegarlo dentro de la app sin cambiar de base tecnológica, sirviendo de acelerador para prototipar pantallas, explorar variantes visuales, y salir del bloqueo de la página en blanco.

El matiz, y conviene tenerlo presente, es que una herramienta de inteligencia artificial tiende a producir precisamente ese aire genérico del que queremos huir, de modo que su valor real no está en aceptar lo que escupe tal cual, sino en usarlo como borrador y luego curarlo con criterio humano, imponiéndole la identidad de mediCampo, los colores propios, la tipografía elegida, y el tono sobrio que pide un producto de salud, porque si no se cura, el riesgo es cambiar una interfaz que sabe a IA por otra que sabe igual, solo que más pulida.

### Astro

Astro me parece una herramienta excelente, pero para un problema que mediCampo casi no tiene hoy, ya que su fuerte es el contenido, los sitios mayormente estáticos, los blogs, las landing y la documentación, donde su arquitectura de islas envía muy poco JavaScript al navegador y rinde de maravilla en carga e indexación, sin embargo mediCampo no es un sitio de contenido, sino una aplicación profundamente interactiva, con sesión autenticada, dashboards que cambian en vivo, y sobre todo una videollamada en tiempo real, terreno donde la filosofía de islas aporta poco y hasta estorba.

Por eso, si Astro entrara en escena, lo razonable sería acotarlo a un sitio público separado, esto es, una página de presentación del proyecto, una sección informativa para pacientes, o la propia documentación de cara al exterior, dejando intacta la aplicación interactiva en React, de manera que cada herramienta atienda aquello en lo que de verdad brilla, sin forzar a una a hacer el trabajo de la otra.

### Leptos

Leptos es, intelectualmente, la opción más seductora de las tres, porque está construido sobre Rust compilado a WebAssembly, ofrece una reactividad de grano fino muy elegante y un rendimiento potencialmente altísimo, así que entiendo perfectamente la curiosidad, no obstante, llevado al caso concreto de mediCampo, la postura honesta es descartarlo, y no por falta de mérito técnico, sino por una suma de costos que no se justifican en este horizonte.

Esos costos son varios y se acumulan, partiendo porque adoptarlo significa una reescritura prácticamente total del frontend, siguiendo porque el ecosistema de Rust para interfaces es mucho más pequeño que el de React, con menos componentes listos y menos respuestas a la mano, agregando que la curva de aprendizaje de Rust es empinada para un equipo formado en JavaScript y TypeScript, y rematando con el detalle decisivo, que es la integración con LiveKit, cuyo SDK pensado para la web es JavaScript, de modo que usarlo desde WebAssembly obliga a puentes incómodos justo en la parte más crítica y sensible del producto, por lo que mi recomendación es guardarlo como aprendizaje personal o como experimento aparte, jamás como base de un sistema clínico que debe funcionar sí o sí.

## Panorama amplio, las decenas de opciones a considerar

Más allá de esas tres, conviene abrir el abanico y mirar el ecosistema completo, no para adoptarlo todo de golpe, que sería un error, sino para tener el menú claro y elegir por dimensión de mejora, así que a continuación agrupo librerías, métodos y conceptos según qué problema resuelven, con la idea de que cada bloque sea una caja de herramientas a la que volver cuando toque atacar esa dimensión.

### Estética profesional y sistema de diseño

Aquí está, a mi juicio, la palanca de mayor impacto inmediato, y el corazón de la propuesta es shadcn/ui, que no es una librería que se instala y bloquea, sino una colección de componentes accesibles que se copian dentro del proyecto y quedan bajo control total, construidos sobre Radix UI, que aporta el comportamiento accesible y robusto de menús, diálogos y formularios, dejando el estilo en manos de Tailwind, y como alternativa de filosofía parecida está Headless UI, que también separa comportamiento de apariencia.

El verdadero salto, sin embargo, no son los componentes sueltos sino adoptar la idea de tokens de diseño, esto es, definir de una vez los colores, la tipografía, los radios, las sombras y los espaciados como variables centrales, y de ahí derivar todo, complementándolo con un modo oscuro coherente, una escala tipográfica deliberada, y manteniendo lucide para los iconos, que ya se usa y es limpio, e idealmente apoyándose en Figma como fuente de verdad del diseño, para que lo visual se decida una vez y se respete en todas partes, que es justo lo que hoy falta.

### Consistencia y catálogo de componentes

Para que ese sistema no se degrade con el tiempo conviene sostenerlo con herramientas de consistencia, empezando por Storybook, que es un catálogo vivo donde cada componente se ve y se prueba de forma aislada, lo que ayuda enormemente a no reinventar botones ni tarjetas, siguiendo por class-variance-authority, que permite declarar de manera ordenada las variantes de un componente, como tamaños o estados, y rematando con tailwind-merge, que evita los conflictos cuando se combinan clases de Tailwind, tres piezas pequeñas que juntas mantienen el orden visual a raya.

### Animación y sensación de uso

La diferencia entre una interfaz correcta y una que se siente profesional suele estar en los detalles del movimiento, y para eso el referente es Framer Motion, hoy llamado simplemente Motion, que permite transiciones y microinteracciones fluidas sin pelear con CSS, complementado por AutoAnimate para animaciones automáticas y baratas en listas y cambios de estado, y por las view transitions del navegador para pasajes entre vistas, siempre con la prudencia de no exagerar, porque en un contexto de salud y de redes lentas, la sobriedad y el respeto por quien prefiere menos movimiento valen más que el lucimiento.

### Estado y manejo de datos

En el plano de los datos, la mejora más rentable es introducir TanStack Query, antes conocido como React Query, que reemplaza el fetch manual disperso por una capa que gestiona caché, reintentos, invalidación y estados de carga y error de forma declarativa, lo que limpiaría buena parte de la lógica repetida que hoy vive en los componentes, y para el estado de interfaz que no viene del servidor, Zustand ofrece una alternativa liviana y simple al exceso de Context, mientras que la persistencia local, como la del chat, ganaría en orden si se encapsula detrás de una pequeña abstracción en lugar de tocar localStorage a mano en cada sitio.

### Formularios y validación

Los formularios son terreno fértil para errores, y mediCampo ya pagó ese precio con el campo obligatorio de la ficha clínica, de modo que adoptar React Hook Form junto con Zod sería un avance doble, porque React Hook Form maneja el estado y el rendimiento de los formularios con poca fricción, y Zod define un esquema de validación único que se comparte entre frontend y backend, atacando de raíz justamente esa clase de fallo en que el formulario no envía un dato que la base exige, además de mejorar los mensajes al usuario y la confianza en lo que se guarda.

### Rendimiento y peso del bundle

Para rendimiento, lo primero es medir antes de optimizar, así que el paso inicial es incorporar un analizador como rollup-plugin-visualizer para ver de qué está hecho el bundle, y a partir de ahí aplicar técnicas conocidas, como dividir el código por rutas con carga diferida, de manera que la pesada videollamada con LiveKit solo se descargue cuando de verdad se entra a una sala, sumando una memoización cuidadosa donde haga falta, virtualización de listas largas con TanStack Virtual si algún historial crece, y a nivel de despliegue, compresión y entrega por CDN, todo orientado a que la aplicación pese poco y arranque rápido, que en zonas rurales no es un lujo sino una necesidad.

### Renderizado, SEO y arquitectura mayor

Si en algún momento pesara de verdad la indexación, el primer pintado o la necesidad de una arquitectura más robusta sin abandonar React, la alternativa seria es Next.js con su App Router y los React Server Components, que permiten renderizar en el servidor, mejorar el SEO y estructurar mejor el proyecto, y en la misma familia conviene tener en el radar a Remix, ahora fusionándose con React Router, y a TanStack Start, todas opciones que ofrecen renderizado en servidor manteniendo el ecosistema React, frente a la decisión, igualmente válida, de seguir en una SPA con Vite si el SEO nunca se vuelve crítico, que para una herramienta interna de salud podría ser perfectamente el caso.

### PWA y funcionamiento sin conexión

Dado el contexto rural, este bloque es casi estratégico, y la buena noticia es que el plan de PWA ya está iniciado y vite-plugin-pwa está presente, de modo que la oportunidad es aprovecharlo de verdad, configurando service workers que cacheen la aplicación y permitan abrirla aun con conexión intermitente, guardando de forma local lo que tenga sentido para sincronizar después, porque un paciente o un médico en una zona con señal débil agradecerá enormemente que la app no se caiga al primer parpadeo de la red, y aquí la inversión rinde directamente en el valor central del producto.

### Accesibilidad e internacionalización

La accesibilidad no es un adorno en salud, sino una obligación ética y muchas veces legal, así que conviene incorporar eslint-plugin-jsx-a11y para detectar problemas mientras se programa, apoyarse en react-aria para componentes verdaderamente accesibles, cuidar el manejo del foco, el contraste de color y la navegación por teclado, y dejar preparada la internacionalización con algo como i18next, no porque haya que traducir hoy, sino porque pensar el texto separado del código desde temprano evita un retrabajo enorme si mañana se quiere atender pueblos originarios u otras lenguas.

### Calidad y experiencia de desarrollo

Por último, la sostenibilidad del código se cuida con prácticas de calidad, partiendo por ESLint y Prettier configurados con rigor, incluyendo la limpieza de esos avisos de imports sin usar que ya aparecieron, siguiendo por una base de pruebas con Vitest y Testing Library para la lógica y los componentes, y con Playwright para las pruebas de extremo a extremo que simulen el flujo real de médico y paciente, rematando con Husky y lint-staged para que nada entre sin revisarse, y con un TypeScript en modo estricto que atrape errores antes de que lleguen al usuario, todo lo cual no se ve en pantalla pero es lo que permite avanzar rápido sin romper lo anterior.

### El núcleo de tiempo real

Sobre el video, que es el alma del producto, mi visión es de continuidad, esto es, permanecer en LiveKit, apoyarse en sus componentes oficiales en lugar de reinventarlos, y dejar la puerta abierta a funcionalidades futuras que el propio LiveKit habilita, como la grabación de la consulta cuando haya consentimiento, o la transcripción automática, siempre subordinando cualquier mejora estética o de framework a la regla de oro de no comprometer la estabilidad de la llamada, porque una interfaz preciosa que corta el audio no le sirve a nadie.

## El hilo que ordena todas las decisiones

Si tuviera que resumir el criterio en una sola idea, sería que mediCampo es telemedicina rural antes que vitrina tecnológica, de modo que cada elección debería pesarse contra lo que de verdad importa en ese escenario, que es la robustez frente a redes malas, la carga liviana en dispositivos modestos, la accesibilidad para usuarios diversos, y una estética sobria y confiable que transmita seriedad clínica, y solo después, muy por detrás, la tentación de adoptar el framework de moda, porque perseguir lo exótico, como una reescritura en Rust, gasta energía que rinde mucho más invertida en que la videollamada no se caiga y en que la interfaz se entienda a la primera.

## Recomendación final, por fases

Ordenando todo lo anterior por sensatez, propongo pensar en fases tentativas, no en una avalancha simultánea, de manera que cada paso entregue valor real antes de abrir el siguiente.

En una fase inicial, de alto impacto y bajo riesgo, atacaría la estética, montando el sistema de diseño con shadcn/ui más los tokens y class-variance-authority, usando v0.dev como apoyo curado para acelerar pantallas, y sumando microinteracciones medidas con Framer Motion, porque esto profesionaliza la cara visible del producto sin tocar la base tecnológica ni arriesgar la operación.

En una segunda fase me ocuparía de la salud del código, incorporando TanStack Query para los datos, React Hook Form con Zod para los formularios, Storybook como catálogo, una base de pruebas con Vitest y Playwright, y la división del código por rutas junto con el análisis del bundle, todo lo cual baja la fricción del desarrollo y previene la próxima tanda de bugs.

En una tercera fase miraría el alcance propio del producto rural, llevando la PWA a su potencial real con una estrategia de funcionamiento sin conexión, reforzando la accesibilidad, y dejando preparada la internacionalización si el proyecto apunta a comunidades con otras lenguas.

Y solo en una cuarta fase, y únicamente si aparece una necesidad concreta, evaluaría Next.js para una eventual capa pública con renderizado en servidor y mejor SEO, o un sitio aparte hecho en Astro para la landing y la documentación, conservando siempre la aplicación interactiva en React, mientras que por ahora dejaría fuera, con tranquilidad, tanto a Leptos por implicar una reescritura difícil de justificar, como a Astro para la parte interactiva, donde no es la herramienta adecuada.

## Cierre

Cierro recordando lo que dije al principio, esto es que esto no es una hoja de ruta firmada sino una bitácora de visión, un intento de dejar por escrito un criterio para no improvisar cuando llegue el momento de mejorar el frontend, de modo que conviene releerlo de vez en cuando, tacharle lo que el tiempo desmienta, y agregarle lo que el propio uso de mediCampo vaya revelando, porque la mejor herramienta no es la más nueva ni la más vistosa, sino la que sostiene mejor a quienes dependen de que esta plataforma funcione.
