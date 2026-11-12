# Instrumentos del piloto de Bug Hunters

Documento de trabajo de JESS-06 (T09). Todos los instrumentos usan el mismo código de participante y los mismos identificadores de caso que el CSV que descarga el juego (DAAJ-03), para cruzar los datos sin transformarlos.

## 1. Llaves comunes con el CSV del juego

El juego descarga un CSV con una fila por intento. Sus columnas, en este orden:

| Columna      | Qué contiene                                                   | Ejemplo               |
| ------------ | -------------------------------------------------------------- | --------------------- |
| `codigo`     | Código del participante, con formato Pxx                       | `P03`                 |
| `caso`       | Identificador del caso                                         | `cambion`             |
| `hipotesis`  | Identificador de la hipótesis elegida                          | `reinicia`            |
| `correccion` | Identificador de la corrección elegida                         | `mas2`                |
| `desenlace`  | Resultado del intento (`correcto`, `incompleto` o `sinCambio`) | `incompleto`          |
| `pistas`     | Pistas usadas hasta ese intento (0 a 3)                        | `1`                   |
| `hora`       | Hora del intento                                               | `2026-11-12T10:15:00` |

Reglas para todos los instrumentos:

- **Código:** siempre `Pxx` (P01, P02...). Es la única forma de identificar a una persona. No se anotan nombres, correos ni grupos junto con los datos (RNF07).
- **Casos:** siempre `loopi`, `confusin`, `nullito` o `cambion`, escritos igual que en el CSV.
- **Momento:** `inicial` o `final`.
- **Respuestas de opción múltiple:** la letra elegida en minúscula (`a`, `b`, `c`), o vacío si no respondió.

## 2. Plan de la sesión

Duración sugerida: 50 minutos por participante. Ajustar al tiempo real de la clase.

| Minutos | Actividad                                          | Instrumento                     |
| ------- | -------------------------------------------------- | ------------------------------- |
| 0–5     | Presentación, consentimiento y asignación de `Pxx` | Guion de apertura (sección 7)   |
| 5–15    | Evaluación inicial                                 | Instrumento 3                   |
| 15–35   | Juego libre de los 4 casos, con `?piloto=1`        | Hoja de observación (sección 6) |
| 35–45   | Evaluación final y caso de transferencia           | Instrumentos 3 y 4              |
| 45–50   | Encuesta de experiencia                            | Instrumento 5                   |

Participantes: **N hasta 50 por grupo**. Nivel del grupo: **7**.

Con grupos de este tamaño:

- **Códigos:** `P01` a `P50`. El formato `Pxx` alcanza hasta `P99`.
- **Equipos:** cada participante necesita su propio equipo con el juego abierto con `?piloto=1`. Si no hay uno por persona, dividir el grupo en tandas, repitiendo la sesión de 50 minutos.
- **Observación:** una sola persona no puede observar a 50 participantes (sección 6). El CSV sí registra a todos.

## 3. Evaluación inicial y final

Mismos reactivos en las dos aplicaciones, para comparar el cambio por concepto. Cada caso aporta 2 reactivos (8 en total). Se aplican en papel o en un formulario, sin que el participante vea el juego.

Cada caso evalúa el concepto que declara en su `datos.ts`:

| Caso       | Concepto                                             |
| ---------- | ---------------------------------------------------- |
| `loopi`    | Ciclo infinito y condición de salida                 |
| `confusin` | Condiciones (si / si no) y operadores de comparación |
| `nullito`  | Valor ausente (nulo) y validación previa             |
| `cambion`  | Variables, asignación y acumulación                  |

Instrucción: «Responde lo que sepas. No es un examen y no afecta tu calificación».

### Cambión · variables, asignación y acumulación (R1 y R2)

**R1.** Observa:

```
total ← 0
para cada caja que llega:
    total ← 1
mostrar total
```

Llegan 4 cajas. ¿Qué muestra el programa?

- a) 0
- b) 1
- c) 4
- d) 10

Correcta: `b`.

**R2.** ¿Qué línea dentro del ciclo hace que el total sea 4 al final?

- a) `total ← 4`
- b) `total ← total + 2`
- c) `total ← total + 1`
- d) `total ← 0`

Correcta: `c`.

### Loopi · ciclo infinito y condición de salida (R3 y R4)

**R3.** Observa:

```
contador ← 1
mientras contador <= 3:
    mostrar contador
```

¿Qué pasa al ejecutarlo?

- a) Muestra 1, 2 y 3, y termina
- b) Muestra 1 una y otra vez, sin terminar
- c) Muestra solo 3
- d) Da un error al empezar

Correcta: `b`.

**R4.** ¿Qué línea hay que agregar dentro del ciclo para que termine?

- a) `contador ← 1`
- b) `contador ← contador + 1`
- c) `mostrar 3`
- d) `contador ← 0`

Correcta: `b`.

### Confusín · condiciones y operadores de comparación (R5 y R6)

**R5.** Observa:

```
destino ← "Sur"
si destino es igual a "Norte":
    enviar al norte
si no:
    enviar al sur
```

¿A dónde se envía el pedido?

- a) Al norte
- b) Al sur
- c) A los dos lados
- d) A ninguno

Correcta: `b`.

**R6.** ¿Qué condición revisa si el destino es «Norte» **sin cambiar** su valor?

- a) `destino ← "Norte"`
- b) `destino es igual a "Norte"`
- c) `"Norte" ← destino`
- d) `destino ← destino`

Correcta: `b`.

> Ajustar la notación a la que usa el juego (en el juego la opción correcta se escribe `destino = "Norte"`).

### Nullito · valor ausente (nulo) y validación previa (R7 y R8)

**R7.** Observa:

```
pedido ← buscar el pedido 118
mostrar el cliente de pedido
```

El pedido 118 no existe, así que `pedido` no tiene valor (es nulo). ¿Qué pasa al ejecutarlo?

- a) Muestra un cliente vacío y sigue sin problema
- b) Falla, porque intenta usar un valor que no existe
- c) Muestra el número 118
- d) Crea el pedido 118 automáticamente

Correcta: `b`.

**R8.** ¿Qué hay que hacer **antes** de mostrar el cliente para evitar el fallo?

- a) Revisar que `pedido` tenga valor: `si pedido no es nulo`
- b) Asignar `pedido ← 0`
- c) Mostrar el cliente dos veces
- d) Borrar el pedido

Correcta: `a`.

### Hoja de captura de respuestas

Una fila por reactivo y por momento. Mismas llaves que el CSV.

| codigo | momento | reactivo | caso    | respuesta | correcta |
| ------ | ------- | -------- | ------- | --------- | -------- |
| P01    | inicial | R1       | cambion | b         | 1        |
| P01    | inicial | R2       | cambion | a         | 0        |
| P01    | final   | R1       | cambion | b         | 1        |

`correcta` vale 1 si coincide con la clave y 0 si no.

## 4. Caso de transferencia

Se aplica **solo al final**. Es un problema que no aparece en el juego, con el mismo tipo de error de Cambión en otro contexto. Mide si el participante transfiere lo aprendido.

Observa:

```
total ← 0
para cada precio en [10, 20, 30]:
    total ← precio
mostrar total
```

- **T1.** ¿Qué muestra el programa? (respuesta abierta). Clave: `30`.
- **T2.** ¿Qué está mal? Elige la causa:
  - a) La lista tiene pocos precios
  - b) El total se reasigna en cada vuelta en lugar de acumular
  - c) El total empieza en 0
  - Correcta: `b`.
- **T3.** Escribe la línea que lo corrige. Clave: `total ← total + precio`. El resultado correcto es `60`.

Captura:

| codigo | caso          | T1  | T2  | T3  |
| ------ | ------------- | --- | --- | --- |
| P01    | transferencia | 30  | b   | 1   |

En T3, 1 si la línea acumula sobre el total anterior y 0 si no.

## 5. Encuesta de experiencia

Se responde al final. Escala de 1 (muy en desacuerdo) a 5 (muy de acuerdo).

| Id  | Afirmación                                              |
| --- | ------------------------------------------------------- |
| E1  | Entendí qué tenía que hacer en cada caso.               |
| E2  | Las instrucciones y el tutorial me ayudaron a empezar.  |
| E3  | La Ayuda me sirvió cuando me atoré.                     |
| E4  | Las pistas me ayudaron sin darme la respuesta.          |
| E5  | Los textos y los botones se leen y se distinguen bien.  |
| E6  | Pude jugar solo con el teclado cuando quise.            |
| E7  | El juego me ayudó a entender por qué falla un programa. |
| E8  | Me gustó jugar.                                         |
| E9  | Volvería a jugar otros casos.                           |

Preguntas abiertas:

- **A1.** ¿Qué fue lo más difícil o confuso?
- **A2.** ¿Qué cambiarías?
- **A3.** ¿Qué fue lo que más te gustó?

Captura:

| codigo | E1  | E2  | E3  | E4  | E5  | E6  | E7  | E8  | E9  | A1  | A2  | A3  |
| ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01    | 5   | 4   | 4   | 3   | 5   | 5   | 4   | 5   | 5   | ... | ... | ... |

## 6. Hoja de observación

La llena la persona que observa, **sin intervenir** salvo que el participante se bloquee más de 2 minutos. Una fila por participante y por caso.

En un grupo grande, cada observador sigue como máximo a **5 o 6 participantes** a la vez. Con un solo observador y 50 participantes, se observa una **muestra** (por ejemplo, 6 códigos elegidos antes de empezar, de distintos puntos del salón) y el resto se analiza solo con el CSV, la evaluación y la encuesta. Anotar en la hoja qué códigos se observaron. Los intentos, pistas y resultados ya salen del CSV, así que **no se anotan aquí**.

| Campo             | Qué se anota                                                                    |
| ----------------- | ------------------------------------------------------------------------------- |
| `codigo`          | Código `Pxx` del participante                                                   |
| `caso`            | `loopi`, `confusin`, `nullito` o `cambion`                                      |
| `hora_inicio`     | Hora en que empezó el caso                                                      |
| `hora_fin`        | Hora en que lo resolvió o lo dejó                                               |
| `estado_atoro`    | Estado donde se detuvo más tiempo (E1 a E5), si se detuvo                       |
| `uso_ayuda`       | `si` o `no`: abrió la capa de Ayuda                                             |
| `uso_tutorial`    | `omitio`, `completo` o `no_aparecio`                                            |
| `duda_verbal`     | Lo que preguntó o comentó en voz alta                                           |
| `problema_ui`     | Error visible, texto confuso o algo que no respondió, con la pantalla (P3 a P6) |
| `problema_acceso` | Problema con teclado, foco, contraste o lectura                                 |
| `observacion`     | Cualquier otra cosa relevante                                                   |

Captura:

| codigo | caso    | hora_inicio | hora_fin | estado_atoro | uso_ayuda | uso_tutorial | duda_verbal | problema_ui | problema_acceso | observacion |
| ------ | ------- | ----------- | -------- | ------------ | --------- | ------------ | ----------- | ----------- | --------------- | ----------- |
| P01    | cambion | 10:12       | 10:19    | E3           | si        | completo     | ...         | ...         | ...             | ...         |

Para cruzar con el CSV, las horas de esta hoja se comparan con la columna `hora` del juego.

## 7. Guion de apertura

1. «Vas a jugar Bug Hunters, un juego para aprender a encontrar errores en programas.»
2. «No es un examen. Si algo no se entiende, el problema es del juego, no tuyo.»
3. «Tu código es **Pxx**. No se registra tu nombre. Puedes parar cuando quieras.»
4. «Si te atoras, dilo en voz alta. Voy a tomar notas.»
5. Abrir el juego con `?piloto=1`, capturar el código `Pxx` en la barra del piloto y empezar con la evaluación inicial.

Al terminar, descargar el CSV desde la barra del piloto y guardarlo con el nombre del código (por ejemplo `P03.csv`).
