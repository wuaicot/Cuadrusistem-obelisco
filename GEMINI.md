# GEMINI.md


-   **Descripción del proyecto:**  Con cargar un archivo PNG del reporte Z (una foto) pueda calcularse el inventario de producción, con base a unas planillas (Planilla Cocina y Planilla Caja) cuya interfaz sera diseñada para que el usuario haga tap en la rejilla del producto, pueda indicar el valor o la cantidad en un sistema que se lee de izquierda a derecha y de arriba a abajo... 
 En primer lugar, debemos leer cada tabla, de izquierda a derecha, y de arriba asia abajo. En tal sentido, tenemos que primero se encuentra el cuadro que contiene el nombre del ingrediente (en este ejemplo usamos el ingrediente Vienesas personal), luego se encuentra la columna que contiene los segmentos o filas: "SALDO INICIAL, ENTRADA, DEVOLUC, Y SALDO FINAL", luego se encuentran las columnas que representan las posibles cantidades, en unidad de decenas (10, 20, 30, 40, 50, 60, 70, 80, 90), centena (100), y unidades (1, 2, 3, 4, 5, 6, 7, 8, 9). Así con esto, si por ejemplo en la planilla de cocina tenemos como saldo inicial 26 unidades de este ingrediente, el operador deberá tocar la tablilla donde se interceptan la fila "SALDO INICIAL" con las columnas del "20" y "6". De este modo, se sumará 20+6, y cada tablilla tocada quedará rellena en color negro para que visualmente el operador vea lo que está marcando. Si a lo largo de la jornada (turno), al area de cocina, se ingresan 34 unidades, el operador deberá tocar las tablillas correspondientes que interceptan la fila "ENTRADA", con las columnas "30" y la correspondiente a la columna "4". En caso de que se deba desechar, o por motivo de merma, o devolución del producto se debe hacer lo propio en el segmento "DEVOLUC". lo aquí marcado debe restar al total de la cantidad para este ingrediente, por ejemplo, si se desechan 3, se debe marcar la tablilla correspondiente para representar dicha cantidad, es decir la que intercepta la tablilla de la fila DEVOLUC con la columna del "3". Por último, tenemos el segmento "SALDO FINAL". Aquí el operador debe indicar la cantidad que le quedó de este ingrediente, por ejemplo, si al finalizar el turno quedan 11, entonces deberá tocar las tablillas correspondientes para representar tal cifra, que en este caso serian "10" y "1", ya que esto suma un total de 11. Esta misma lógica se aplica para ambas planillas: "Planilla Caja" y "Planilla Cocina". En cuanto al "reporte Z" ya tendremos la oportunidad de conocer la metodología con la que el sistema reconocerá los datos, ya que este documento se obtendrá mediante la carga del archivo, ya que dicho documento es impreso y la unica forma de digitalizarlo es mediante una foto desde el teléfono móvil. Te dejo un ejemplo de la tabla del ingrediente "Vienesas personal"(frontend-cuadrusistem/src/assets/Planilla_para_cuadrusistem.png) usando las mismas cantidades con la que te di la explicación, para que observes como luce con las tablillas rellenas, luego que el operador toque el respectivo recuadro. En este ejemplo tenemos la siguiente operación: 
 * SALDO INICIAL= 26 
 * ENTRADA= 34 
 * DEVOLUC= 3  
 * SALDO FINAL= 11 
 NOTA: SI UNA FILA COMPLEA ESTÁ DESMARCADA, SIGNIFICA = 0

 Esto se interpreta así: 26+34-3=57-11. Entonces el "reporte Z" debería indicar que se vendieron las suficientes cantidades de MENUS o EMPANADAS, que justifique el uso de 46 unidades de este ingrediente (Vienesas personal). esto arrojaría un "OK", de lo contrario existen los escenarios, "faltante" en caso de que se hallan vendido menos de 46 (ejm. 45, entonces falta 1) o, "SOBRANTE" en el caso de haberse vendido más de 46 (ejm. 47, entonces sobra 1). 
Hagamos un consenso en cuanto a la definición de lo que es una planilla,
  una tabla y una tablilla. 1) Planilla/s: Son todas las tablas. Existen dos planilas "planillaCocina" y "planillaCaja" 2) Tabla/s: representa un ingrediente (en el caso de la "Planilla de Caja" una tabla representa
  un producto bebestible), cada tabla está conformada por: a)áre del nombre del ingrediente, b)área que contiene el "SALDO INICIAL", "ENTRADA", "DEVOLUC", "SALDO FINAL". También contiene el área de columnas que
  representa las cantidades en número, a esta área le llamaremos "segmento de columnas" (10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9)". 3) Tablilla/s: llamarémos "tablilla" a cada cuadro dentro
  de la fila que untercepte con la columna, por ejemplo, en la fila de DEVOLUC el usuario hace tap en la tablilla que representa el 70. NOTA: ya que cada tabla es independiente, debe ser separadas con un pequeño
  espacio entre sí, claramente demarcada con un borde, y deben ser cada una considerada como una entidad independiente que guarda la información en su respectivo lugar dentro de la base de datos "cuadrusistem". 
   NOTA: En el archivo "frontend-cuadrusistem/src/assets/Planilla_para_cuadrusistem.png", se encuentra una grafica que representa fielmente mi
  deseo en cuanto a estetica y tecnisismo de como quiero que sean las tablas, y por ende las planillas. Verás que las "Tablillas en las que el usuaria hace tap, se oscurecen o rellenan en azul marino oscuro, y si
  toca nuevamemte se desmarca (tambien se resta en la cantidad representada en numeros)".
-   **Tecnologías clave:** librería de OCR (usa la tecnologia OCR que usa Google para reconocer textos y numeros) Quiero que integres un sistema exelente para la lectura, comprención e interpretación de los datos extraido de un archivo .png ó .jpg ...etc.

-   **Objetivos del proyecto:** calcular el consumo de los ingredientes usados en la elaboración de diversos menús de comida rápida en un restaurante. Actualmente estos cálculos se hacen de forma manual, basándose en un reporte de productos "reporte Z" emitido por el sistema de ventas e impreso en papel térmico de 80mm. Este reporte es el que contiene la información de los códigos, nombres y cantidades de cada MENUS, BEBESTIBLES y EMPANADAS que fueron vendidos ese día, por ejemplo, "4246, CORONA BOTELLIN, 1" | "0911, CHUR MEXICANO GIG, 1" | "3601, EMP CAMARON QUESO FR". Tambien son usados para este cálculo, dos planillas llamadas, "Planilla Cocina" y "Planilla Caja". En la Planilla cocina (Planilla Cocina) se muestran las tablas de los diversos ingredientes que son usados para la elaboración de "MENUS" y "EMPANADAS". En la planilla de Caja (Planilla Caja) se muestran las tablas de los diversos "BEBESTIBLES" que se comercializan en el restaurante. Tanto el área de cocina, como el de caja son totalmente distintos e independientes el uno del otro, pero a la vez son simbioticas.
-   **Preferencias de estilo/código:** se usaran las mejores practicas de desarrollo segun EMC6. Debes garantizar que funcione de forma optima en dispositivos móviles compactos.
-   **Ignorar archivos/carpetas:**# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
 
# Environment variables
.env

-   **Preguntas frecuentes:** Respuestas a preguntas comunes sobre el proyecto.

---

**Ejemplo de contenido:**

este es un desarrollado con NestJS, ReactJS y TypeScript. Usa TaildWindcss para los estilos.
El objetivo principal es gestionar la lógica de negocio y la interfaz de usuario para la aplicación de cuadre y reportes Z.

**Tecnologías:**
NestJS
- TypeScript
- Express
- TypeORM
- todo lo necesario.
- PostgreSQL. y en el frontend: 
- React
- Vite
- Taildwind
- todo lo necesario.

**Convenciones:**
- Sigue el estilo de código que respeten las mejores y actuales practicas (EMC6, ESLint y Prettier).
- Prefiere el uso de DTOs para la validación de entrada.
- Comentarios en español.
- lenguage a usar: español.
- asegurate de que sea 100% adaptativo para dispositivos compactos, especialmente en dispositivos Appel´s, Androids y Tablet´s en posición vertical. Las planillas deben adaptarse a la pantantalla tanto en vertical como en horizontal. No se permite el scroll horizontal.

**estado actual:**
Hemos logrado consolidar un motor de análisis que no solo lee texto, sino que entiende el contexto de las secciones y el catálogo de productos, lo cual es fundamental para garantizar que el cálculo de inventario sea exacto en cada uno de los dos reportes diarios.

   1. Lógica de Negocio y Cálculo (El Corazón del Sistema):
  La relación está en el archivo "backend-cuadrusistem/src/domain/recetas.ts", y los ingredientes están en el archivo "backend-cuadrusistem/src/routes/debug.routes.ts". Mapeo estático.
  No existe tal cosa como "combos", pero, si existen algunos productos vendidos que consumen mas de un ingrediente, ejemplo,
   "typescript"
      "2307": {
    codigo: "2307",
    nombre: "HAMBURG OBELISCO PER",
    categoria: 'COCINA',
    ingredientes: [
      { nombre: "Pan Brioche 12", cantidad: 1 },
      { nombre: "Carne hamburg. Porc.", cantidad: 1 },
      { nombre: "Queso laminado", cantidad: 2 },
      { nombre: "Cheddar porc" , cantidad: 1 },
      { nombre: "Tocino porciones", cantidad: 1 },
      { nombre: "Huevos", cantidad: 1 },
      { nombre: "Papas personal 150gr", cantidad: 1 },    ],
  },.

  2. Implementación del OCR:
 
    la esencia de este proyecto es la CONFIABILIDAD, es supremamente importante que el OCR "no falle" o solo falle por factores fortuitos ej. si el ticket del reporte Z está roto, cortado, arrugado, manchado, o deteriorado de tal forma que sea imposible inferir su código, nombre y/o cantidad aún ni por el ojo humano. De resto debe garantizar la lectura y entendimiento del texto y numeros.
     La robustes del motor actual esta probada y ha demostrado un buen rendimiento, es posible algunas mejoras para que quede exelente. Se está usando Sharp, en cuanto a esto, Quisiera implementar un cambio que me permita poder tomar la foto directamente desde mi dispositivo (en el componente donde se carga el archivo del Z) para agilizar aún mas el proceso. tambien acepto sugerencias sobre si es mejor usar Canvas. 
    

  3. Persistencia de Datos:
 
     deben existir dos turnos: 1er Turno y 2do Turno. (es necesario que en las planillas, el "SALDO FINAL" del turno antedior, debe ser el "SALDO INICIAL" del sigiente turno) el 1er turno es de 10:00 a 18:00 y, el 2do turno de 18:00 a 2:00.

  4. Interfaz de Usuario (El sistema de "Tablillas")
  
     las planillas podrian irse rellenando a medida que el turno transcurre. Al iniciar el 1er Turno, el usuario debería ver marcadas las respectivas casillas correspondientes al saldo inicial (y en adelante, el proximo turno cumplirá con esta logica etc, etc...), en su debido momento el usuario ingresará la "ENTRADA" de cada uno de los ingredientes, tambien de ser necesario ingresara "DEVOLUC", y unos minutos antes del fin del turno, ingresara lo correspondiente en "SALDO FINAL". 
     Deben existir dos botones (actualmente existe uno "FINALIZAR Y GUARDAR"), "GUARDAR", y "ENVIAR", este último se habilitará 15 minutos antes del fin del turno, para que el usuario finalmente pueda enviar todo, de una sola vez a "Administración" (Generar Reporte de Cuadre), y pueda ser elegido desde el campo desplegable para la planilla. En cuanto al botón GUARDAR, éste solamente guarda en la BDD lo que el usuario va avanzando, para que permanezcan los datos hasta el momento de enviar.
   
      La facilidad del diseño de las tablillas permite que si por error, toca una, simplemente puede hacer tap de nuevo en la misma tablilla y se reversará. Sería genial poder blooquear y desbloquear toda la planilla, ubicando un icono de candado al lado del boton "SALIR". 

  5. Estado de Integración
   aquí hasta ahora todo va bien y en serio,pero, hay cosas que mejorar como, por ejemplo, el hecho de que pueda detectar la fecha y el turno (por la hora y fecha en que fue impreso el Z), solo si por alguna razón no lo detecta, permitir la posibilidad de hacerlo manualmente. 



 






  