---
title: Chunky, bonitas imágenes de Minecraft
author: Melchor Garau Madrigal
tags: ["chnky","render engine","minecraft","imagenes"]
date: 2016-03-27 00:00:00 +0100
thumb: chunky.png
---

<div class="embed-responsive embed-responsive-16by9">
    <img src="assets/img/chunky1.png" class="embed-responsive-item">
</div>
<br>
Se ve muy bien este mapa de Minecraft, ¿verdad? _Shaders_ estareis pensando, pero
la realidad es que no. Hablamos de **Chunky**, una herramienta de renderizado¹
para Minecraft. Es capaz de crear imágenes increibles de tus mapas de Minecraft
con unos clicks y mucho tiempo.

La imágen anterior es un ejemplo de renderizado con chunky que con cierta *magia*
se consigue la noche, la oscuridad y las dos calabaza-linterna iluminando parte
del escenario. Esta imagen ha tardado algo más de una hora en renderizarse (en
dejar procesar el algoritmo de chunky para obtener dicho resultado). El único
inconveniente que le veo a esta gran herramienta es que solo usa CPU para el
procesamiento, en lugar de usar la GPU (_la tarjeta gráfica_) que sería mucho
más rápido. Pero como dice el propio desarrollador, "el soporte a GPU puede
ser añadido en un futuro". Esperemos que sea así por que dicha herramienta es
muy buena.

<div class="row">
    <div class="col-md-4">
        <img src="assets/img/chunky2.png" style="margin-top:10px;margin-bottom:10px">
    </div>
    <div class="col-md-8">
<a href="http://chunky.llbit.se" target="_blank">Chunky</a> se puede descargar
desde su web (<a href="http://chunky.llbit.se" target="_blank">enlace</a>)
y está disponible para cualquier plataforma que soporte Java. Para Windows y Mac,
viene con un <i>Launcher</i> que te permite actualizarlo y manejar algunas opciones
antes de abrir Chunky. Una vez descargado, solo hay que cargar un mapa de los
nuestros, seleccionar los <i>chunks</i> que usaremos en el escenario (pista:
    cuanto menos chunks hayan, más rápido puede ir y menos memoria ram necesitará).
    En la pestaña de <i>3D Render</i>, apretamos <i>New Scene</i> y nos aparecerá
    dos nuevas ventanas, una con opciones y la otra con la vista desde la cámara.
    Movemos la cámara con el ratón y el botón izquierdo y nos desplazamos con
    W A S D. <a href="http://chunky.llbit.se/getting_started.html" target="_blank">
    Chunky Getting Started</a> para introducirse en el programa y <a target="_blank"
    href="http://chunky.llbit.se/user_interface.html">Chunky User Interface</a>
    para ver algunas de las opciones que ofrece Chunky más afondo y sacarle partido
    a esta gran herramienta.
    </div>
</div>
<br>
Aquí os dejo algunos de los renders que he hecho para probar, son preciosos.

- [Pumpkins near the river](assets/img/chunky1.png)
- [My bedroom](assets/img/chunky2.png)
- [House and the lake](assets/img/posts/chunky.png)

Entrando en aspectos más técnicos de la aplicación, al empezar a renderizar una
imagen, observareis que al principio se ve todo muy borroso y con mucho ruido,
sobretodo al activar la iluminación de emitidores (_emitters_). Esto se debe a
que el algoritmo usado se basa en un procedimiento de emisión de rayos desde un
objeto que emite luz a cualquier objeto que haya por en medio y rebotan hasta
un máximo de veces. Este algoritmo se llama *Path Tracing* (más info
[mirad en Path Tracing en Chunky](http://chunky.llbit.se/path_tracing.html) o en
[Wikipedia sobre este mismo tema](https://en.wikipedia.org/wiki/Path_tracing)).
No hay que preocuparse con estos resultados iniciales, con más _Samples Per Pixel_
(SPP) se usen, mejor resultado obtendremos, y se puede ir reajustando sobre la
marcha este valor.

Disfrutad de grandes escenarios, explorad todas las opciones que ofrece la app,
maravillaos con los resultados: **Chunky**.

Un saludo.

##### ¹ Aplicar una serie de algoritmos para obtener una imágen que representa un escenario o algo por el estilo, véase lo que hace cualquier videojuego frame per frame o chunky con la imagen resultante
