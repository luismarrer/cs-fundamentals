# ⚡ Fundamentos de Computación — Del transistor a la CPU

Sitio web educativo de Ciencias de la Computación. Un viaje de abajo hacia
arriba: cómo un interruptor de silicio se convierte en puertas lógicas, las
puertas en operaciones aritméticas, y las operaciones en un procesador
completo.

## El curso

| # | Capítulo | Qué aprendes |
|---|----------|--------------|
| 01 | [El transistor](capitulos/01-el-transistor.html) | Semiconductores, dopaje N/P y el MOSFET como interruptor controlado por voltaje. Demo interactiva de un MOSFET. |
| 02 | [Puertas lógicas](capitulos/02-puertas-logicas.html) | Serie = AND, paralelo = OR, inversión = NOT. CMOS, tablas de verdad y la universalidad de NAND. Laboratorio de puertas en vivo. |
| 03 | [Del bit a la suma](capitulos/03-del-bit-a-la-suma.html) | Binario, medio sumador (XOR + AND), sumador completo, complemento a dos y la ALU. Sumador de 4 bits interactivo. |
| 04 | [Memoria](capitulos/04-memoria.html) | Realimentación, latch SR, flip-flop D, el reloj y la jerarquía de memoria. Demo de un bit que recuerda. |
| 05 | [La CPU](capitulos/05-la-cpu.html) | Arquitectura de von Neumann, ISA y el ciclo fetch–decode–execute. Simulador paso a paso de una CPU de juguete. |

## Proyectos relacionados

- **[Boolean Synth](https://boolean-synth.vercel.app/)** — diseñador interactivo de circuitos lógicos.
- **[Soroban Learning System](https://v0-abacus-learning-system.vercel.app/)** — aprende a calcular con el ábaco japonés.

## Desarrollo

Es un sitio 100 % estático (HTML + CSS + JS vanilla, sin dependencias ni build).

```bash
# opción 1: abrir directamente
open index.html

# opción 2: servidor local
python3 -m http.server 4173
# → http://localhost:4173
```

## Despliegue

Compatible tal cual con Vercel, Netlify o GitHub Pages (no requiere build:
framework preset "Other" / directorio raíz).

## Estructura

```
├── index.html            # portada: curso + proyectos
├── capitulos/            # los 5 capítulos
└── assets/styles.css     # estilos globales (tema claro/oscuro automático)
```
