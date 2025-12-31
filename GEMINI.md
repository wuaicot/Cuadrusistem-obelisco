# GEMINI.md

Este archivo se utiliza para proporcionar contexto adicional o instrucciones específicas al modelo Gemini sobre este proyecto.

Puedes incluir información como:

-   **Descripción del proyecto:**  con cargar un archivo PNG (una foto) del reporte Z pueda calcularse el inventario de produccion, con base a unas planillas (Planilla Cocina y Planilla Caja) cuya interfaz sera diseñara para que el usuario acer tap en la regilla del producto, pueda indicar el valor o la cantidad en un sistema que se lee de izquierda a derecha y de arrima a abajo.. 
bueno permíteme explicarte cómo funciona la tabla. En primer lugar, debemos leer cada tabla, de izquierda a derecha, y de arriba asia abajo. En tal sentido, tenemos que primero se encuentra el cuadro que contiene el nombre del ingrediente (en este ejemplo usamos el ingrediente Vienesas personal), luego se encuentra la columna que contiene los segmentos o filas: "SALDO INICIAL, ENTRADA, DEVOLUC, Y SALDO FINAL", luego se encuentran las columnas que representan las posibles cantidades, en unidad de decenas (10, 20, 30, 40, 50, 60, 70, 80, 90), centena (100), y unidades (1, 2, 3, 4, 5, 6, 7, 8, 9). Así con esto, si por ejemplo en la planilla de cocina tenemos como saldo inicial 26 unidades de este ingrediente, el operador deberá tocar la casilla donde se interceptan la fila "SALDO INICIAL" con las columnas del "20" y "6". De este modo, se sumará 20+6, y cada casilla tocada quedará rellena en color negro para que visualmente el operador vea lo que está marcando. Si a lo largo de la jornada (turno), al area de cocina, se ingresan 34 unidades, el operador deberá tocar las casillas correspondientes que interceptan la fila "ENTRADA", con las columnas "30" y la correspondiente a la columna "4". En caso de que se deba desechar, o por motivo de merma, o devolución del producto se debe hacer lo propio en el segmento "DEVOLUC". lo aquí marcado debe restar al total de la cantidad para este ingrediente, por ejemplo, si se desechan 3, se debe marcar la casilla correspondiente para representar dicha cantidad, es decir la que intercepta la casilla de la fila DEVOLUC con la columna del "3". Por último, tenemos el segmento "SALDO FINAL". Aquí el operador debe indicar la cantidad que le quedó de este ingrediente, por ejemplo, si al finalizar el turno quedan 11, entonces deberá tocar las casillas correspondientes para representar tal cifra, que en este caso serian "10" y "1", ya que esto suma un total de 11. Esta misma lógica se aplica para ambas planillas: "Planilla Caja" y "Planilla Cocina". En cuanto al "reporte Z" ya tendremos la oportunidad de conocer la metodología con la que el sistema reconocerá los datos, ya que este documento se obtendrá mediante la carga del archivo, ya que dicho documento es impreso y la unica forma de digitalizarlo es mediante una foto desde el teléfono móvil. Te adjunto un ejemplo de la tabla del ingrediente "Vienesas personal" usando las mismas cantidades con la que te di la explicación, para que observes como luce con las casillas rellenas, luego que el operador toque el respectivo recuadro. En este ejemplo tenemos la siguiente operación: * SALDO INICIAL= 26 * ENTRADA= 34 * DEVOLUC= 3 * SALDO FINAL= 11 Esto se interpreta así: 26+34-3=57. Entonces el "reporte Z" debería indicar que se vendieron las suficientes cantidades de MENUS o EMPANADAS, que justifique el uso de 11 unidades de este ingrediente. esto arrojaría un "OK", de lo contrario existen los escenarios "faltante" en caso de que se hallan vendido menos de 11 (ejm. 10, entonces falta 1) o, "SOBRANTE" en el caso de haberse vendido más de 11 (ejm. 12, entonces sobra 1)
-   **Tecnologías clave:** en backend:
 NestJS
- TypeScript
- Express
- TypeORM
- más todo lo necesario.
- PostgreSQL. y en el frontend: 
- React
- Vite
- Taildwind
- más todo lo necesario.

-   **Objetivos del proyecto:** Estoy ideando un sistema que tiene como objetivo calcular el consumo de los ingredientes usados en la elaboración de diversos menús de comida rápida en un restaurante. Actualmente estos cálculos se hacen de forma manual, basándose en un reporte de productos "reporte Z" emitido por el sistema de ventas e impreso en papel térmico de 80mm. Este reporte es el que contiene la información de los códigos, nombres y cantidades de cada MENUS, BEBESTIBLES y EMPANADAS que fueron vendidos ese día, por ejemplo, "4246, CORONA BOTELLIN, 1" | "0911, CHUR MEXICANO GIG, 1" | "3601, EMP CAMARON QUESO FR". Tambien son usados para este cálculo, dos planillas, llamadas "Planilla Cocina" y "Planilla Caja". En la Planilla cocina (Planilla Cocina) se muestran las tablas de los diversos ingredientes que son usados para la elaboración de "MENUS" y "EMPANADAS". En la planilla de Caja (Planilla Caja) se muestran las tablas de los diversos "BEBESTIBLES" que se comercializan en el restaurante. A continuación, te ilustraré con los nombre y códigos los diversos elementos del inventario (el inventario está incompleto por ahora), para que tengas una idea clara del tema.
-   **Preferencias de estilo/código:** se usaran las mejores practicas de desarrollo segun EMC6.
-   **Ignorar archivos/carpetas:** Listado de archivos o carpetas que Gemini debería ignorar al analizar el código.
-   **Preguntas frecuentes:** Respuestas a preguntas comunes sobre el proyecto.

---

**Ejemplo de contenido:**

este es un desarrollado con NestJS, ReactJS y TypeScript. Usa taildwing para los estilos.
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
- asegurate de que sea 100% adaptativo para dispositivos compactos, especialmente en dispositivos Appel´s, Androids y Tablet´s en posición vertical.