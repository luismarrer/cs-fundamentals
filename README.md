# ⚡ Fundamentos de Computación — Del transistor a la CPU

Sitio web educativo de Ciencias de la Computación. Un viaje de abajo hacia
arriba: cómo un interruptor de silicio se convierte en puertas lógicas, las
puertas en operaciones aritméticas, y las operaciones en un procesador
completo.

Construido con [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) + [pnpm](https://pnpm.io).

## El curso

| # | Capítulo | Qué aprendes |
|---|----------|--------------|
| 01 | [El transistor](src/pages/capitulos/01-el-transistor.astro) | Semiconductores, dopaje N/P y el MOSFET como interruptor controlado por voltaje. Demo interactiva de un MOSFET. |
| 02 | [Puertas lógicas](src/pages/capitulos/02-puertas-logicas.astro) | Serie = AND, paralelo = OR, inversión = NOT. CMOS, tablas de verdad y la universalidad de NAND. Laboratorio de puertas en vivo. |
| 03 | [Del bit a la suma](src/pages/capitulos/03-del-bit-a-la-suma.astro) | Binario, medio sumador (XOR + AND), sumador completo, complemento a dos y la ALU. Sumador de 4 bits interactivo. |
| 04 | [Memoria](src/pages/capitulos/04-memoria.astro) | Realimentación, latch SR, flip-flop D, el reloj y la jerarquía de memoria. Demo de un bit que recuerda. |
| 05 | [La CPU](src/pages/capitulos/05-la-cpu.astro) | Arquitectura de von Neumann, ISA y el ciclo fetch–decode–execute. Simulador paso a paso de una CPU de juguete. |

## Proyectos relacionados

- **[Boolean Synth](https://boolean-synth.vercel.app/)** — diseñador interactivo de circuitos lógicos.
- **[Soroban Learning System](https://v0-abacus-learning-system.vercel.app/)** — aprende a calcular con el ábaco japonés.

## Desarrollo

```bash
pnpm install
pnpm dev        # servidor de desarrollo → http://localhost:4321
pnpm build      # build de producción en dist/
pnpm preview    # sirve el build de producción
```

## Despliegue

Sitio estático generado por Astro: compatible tal cual con Vercel (framework
preset "Astro"), Netlify o GitHub Pages.

## Estructura

```
├── src/
│   ├── pages/            # index + capitulos/ (una página por capítulo)
│   ├── layouts/          # BaseLayout (chrome común) y ChapterLayout (prosa + pager)
│   ├── components/       # Card (tarjetas del índice)
│   └── styles/global.css # Tailwind: tokens de tema + capa de componentes
└── astro.config.mjs
```
