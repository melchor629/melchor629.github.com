---
title: Watch-time, un experimento de reloj con Cocoa y GTK3
author: Melchor Alejo Garau Madrigal
thumb: watch-time/sadtime.gif
date: 2017-09-28 18:30:00 +0100
layout: nothing
---

El tiempo. Nunca se detiene, siempre avanza. En nuestros ordenadores siempre tenemos algo que nos indica que hora es. Y me dije hace unos años (en 2014 o 2015): _"¿Seré capaz de hacer un reloj para mac sin usar Xcode?"_ A si que nada mas pensarlo, a ello me puse. Conseguí una aplicación sencilla que solo te decia la hora. Y con solo me refiero a que ni Cmd+Q funcionaba. Hace unas 2 semanas (de la escritura de la entrada) vi ese archivo en mi escritorio y pensé _"Voy a hacerlo guapo. Que sea minimalista y algo mas personalizable"_ Y a ello me puse. Y así surgió este experimento de reloj: sin marcos, de fondo transparente, con posibilidad de ponerlo en frente de todas las ventanas, personalizable en fuente y color. Y todo eso posible mediante atajos de teclado, o usando el menú.

<div style="text-align: center">
<img alt="Ejemplo del reloj en modo digital, personalizado con un color verde lima y la fuente Fira Code" src="/assets/img/posts/watch-time/watch-time1.png">
</div>

Como podréis ver, en mac tiene bastantes opciones para personalizarlo. Pero aún hay otra opción más: en macOS en el dock se muestra un reloj analógico (a 10fps).

<div style="text-align: center">
<img alt="El reloj analógico en el Dock de macOS" src="https://github.com/melchor629/watch-time/raw/master/watch.gif">
</div>

Bastante logrado la verdad. Queda chulo.

También decidí hacer este mismo programa pero para Linux usando GTK3. En aspectos generales, es igualito al de mac, pero el detalle importante es que como no existe el Dock en Linux, en lugar de ocultar el reloj, existe la opción de _cambiar modo_. Esta opción cambia entre el reloj digital y el analógico (ambos tienen el mismo aspecto que en Mac). Otro detalle es que en Linux no todos los gestores de ventanan implementan la opción de _Siempre encima_, por lo que no lo he incluido. Como tenia que ser una ventana sin marcos ni bordes ni nada por el estilo, no puede tener un menú, por lo que obté por poner los atajos de teclado en la salida de la terminal :-)

Podéis ver el código fuente de ambos relojes en [el repositorio watch-time](https://github.com/melchor629/watch-time), y también podéis descargar los ejecutables para [macOS (aka OS X)](https://github.com/melchor629/watch-time/releases/download/v0.1/time-osx.7z) y [linux](https://github.com/melchor629/watch-time/releases/download/v0.1/time-linux.7z).