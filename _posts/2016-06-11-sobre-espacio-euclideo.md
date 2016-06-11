---
author: Melchor Garau Madrigal
title: Sobre 'Espacio Euclídeo'
date: 2016-06-11 16:30:00 +0100
thumb: esp-eucl.png
---

<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
![Espacio euclídeo WebGL](/assets/img/posts/esp-eucl.png)

Esta obra de arte de WebGL me ha llevado un día hacerlo. Es curioso que solo un día haya sido, pero parte del concepto ya lo tenia hecho en Java (_aunque no da tan buen rendimiento como este_). En esta entrada voy a explicar como funciona por dentro [esta página](/eugl) y los secretos que hay.

**Advertencia**: si no tenéis conocimientos de OpenGL, es posible que os cueste entender el texto, pero voy a intentar hacer todo lo que pueda para que sea entendible. WebGL es OpenGL ES un pelín especial. También hay algo de lenguaje matemático y de DOM API + jQuery.

## Introducción
La idea de este espacio de planos con imágenes es tener $$5(ALTURA + ANCHURA)$$ planos, con una profundidad de $$ALTURA + ANCHURA$$ pixeles. Los planos se crean al rededor de ese eje Z repartidos linealmente entre el rango:

$$\{(x, y, z) \in \Bbb R ^3 /-AN/10 < x < AN/10, -ALT/10<y<ALT/10, -(ALT+AN)<z<0 \}$$

según el eje de coordenadas usados por el engine (_luego hablaremos de Three.js_). A partir de ahora llamaremos a $ALTURA - ALT$ y a $$ANCHURA - AN$$. Esos puntos se generan aleatoriamente. El código asociado a esto está en la [linea 183](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L183).

Una vez tengamos todos esos puntos, solo hay que representarlos continuamente. Eso si, he puesto que si la ventana no está enfocada (_en primer plano_) entonces no renderice nada. La cámara además avanza en cada fotograba a una velocidad de $$25u/s$$. Si se sale del escenario, vuelve a empezar desde el principio. [Linea 267](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L267).

## Preparando para renderizar todo
Pero, ¿cómo hago para decirle a la GPU que tiene que representar y como?. Ahi es cuando viene el OpenGL :) Yo uso la biblioteca [Three.js](http://threejs.org) para simplificar la tarea de renderizar todo. Línea 133:

```javascript
    //Creamos la escena y la cámara
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
```

Creamos una escena que contendrá todos los objetos y la cámara. Dicha cámara tendrá una representación de Perspectiva, es decir, como todas las cámaras que usamos. Con un [FOV](https://en.wikipedia.org/wiki/Field_of_view) de 45º. Y el objeto más lejano que se puede ver estará a 100 unidades (_de algo, imaginad metros_). Luego tenemos que preparar el contexto de OpenGL (WebGL), mas abajo de la 133:

```javascript
//Preparamos WebGL
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    var gl = renderer.context;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x121212);
    renderer.setPixelRatio(window.devicePixelRatio);
    $('.container').first().append(renderer.domElement);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
```
A este contexto le indicamos que vamos a usar transparencia (`alpha: true` _y las lineas de_ `gl.enable(gl.BLEND)` _y la siguiente_) y cual va a ser el tamaño del objeto donde dibujar (_canvas_), y aplicamos algunas optimizaciones (*CULL_FACE*). Y lo más importante: añadimos el `canvas` al documento.

Por que si, creo el lugar donde almacenar todas las texturas y el `TextureLoader`  de Three.js en las siguientes lineas.

Bien, ahora empezamos a crear lo tocho del asunto: los planos y donde estarán ubicados. Yo he usado lo que se conoce como *Instancing*, no es mas que un mismo objeto renderizado varias veces (entre comillas). Esto ahorra muchas llamadas de OpenGL y hace que vaya todo más rápido. Creamos un objeto `THREE.InstancedBufferGeometry` que almacenará la geometría del plano, las coordenadas de las texturas y donde estarán todos los planos. Lo primero que hago es guardar la geometría del plano. El atributo lo llamamos `position`, esto nos permite acceder desde los Shaders a esa información (_luego veremos Shaders_). El plano está compuesto de dos triángulos (_la GPU le gustan mas los triángulos que los cuadrados_) L158:

```javascript
//Un plano compuesto por dos caras triangulares
    var vertices = new THREE.BufferAttribute(new Float32Array([
        -1,  1, 0,
        -1, -1, 0,
         1,  1, 0,
        -1, -1, 0,
         1, -1, 0,
         1,  1, 0
    ]), 3);
    geometry.addAttribute('position', vertices);
```

Se indica los vértices que formarán los dos triángulos. (El dibujo es sensacional)
![Tríangulo en la GPU](/assets/img/posts/plano-gl.png)

En la siguientes lineas (L170), se guardan las coordenadas para las texturas (_como representamos la textura sobre la superficie del objeto_):

```javascript
    //Las coordenadas UV para texturas
    var uv = new THREE.BufferAttribute(new Float32Array([
        0, 1,
        0, 0,
        1, 1,
        0, 0,
        1, 0,
        1, 1
    ]), 2);
    geometry.addAttribute('uv', uv);
```

Ya hemos comentado que hace las lineas a partir de la 180. Pero no por que ordenamos los puntos. Para renderizar bien los objetos transparentes, hay que renderizar primero los más lejanos y luego los más cercanos relativamente desde el origen. Entonces (L191):

```javascript
    //Los ordenamos de lejos a cerca para evitar un mal rendering
    espacio = espacio.sort(function(a, b) {
        return Math.sign(Math.round(b.lengthSq() - a.lengthSq()));
    });
```

Ordena los puntos de más lejos a mas cerca. Así evitamos que salgan planos transparentes selectivamente. Es importante guardar los vectores en la GPU :) El atributo lo hemos llamado `offset`.

Ahora tenemos que hacer algo para representar todo este asunto. Ahora es cuando entra en juego los Shaders. Los shaders son programas para la GPU que le dicen como tiene que hacer X cosa. Hay varios tipos, pero hablaremos del _vertex shader_ y el _fragment shader_. _Vertex shader_ indica a la GPU donde hay vértices y donde los coloca. Aquí es donde entra en juego el _Instancing_ comentado antes. Solo tenemos una geometría (el plano), pero hay muchos planos. L55:

```GLSL
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

varying vec2 uvFrag;
varying float zVal;

void main() {
    vec3 pos = offset + position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    uvFrag = uv;
    zVal = gl_Position.z;
}
```

Este shader recibe los vértices (`position`), las coordenadas UV (`uv`) y los offsets antes comentado (`offset`) como variables `attribute`. Luego nosotros le pasamos otras variables (`uniform`), aunque realmente son variables que le pasa Three.js. Y por último, pasamos alguna información al Fragment Shader (`varying`).
Con esta información, calculamos donde se tiene que situar cada vértice de cada plano cogiendo la geometría del plano original y sumándola a la posición del plano (`vec3 pos = offset + position;`). Esa posición hay que transformarla para que se pueda ver con la proyección de la cámara (siguiente linea) y guardamos el resultado en la salida `gl_Position`. Luego le pasamos al FS uv y la coordenada Z del vértice final.

```GLSL
precision highp float;

uniform float opacity;
uniform sampler2D texture;

varying vec2 uvFrag;
varying float zVal;

void main() {
    gl_FragColor = texture2D(texture, uvFrag);
    gl_FragColor.a *= opacity;
    if(zVal >= 90.0) {
        gl_FragColor.a *= (100.0 - zVal) / 10.0;
    }
}
```

Este es el código del Fragment Shader.  Como extra, recibe dos argumentos que asignamos nosotros, un float opacidad y ese `sampler2D` (_es el tipo de las texturas en los Shaders_). La tarea del Fragment Shader es la de pintar la pantalla (simplificación extrema). La GPU llama a este programa para cada pixel de cada cara de cada objeto. En él hay que decirle que tiene que pintar. Este shader (el de arriba) coge la textura que se le pasa por la variable `texture` en las coordenadas `uvFrag` (mas o menos). Eso lo guardamos en la salida `gl_FragColor`. Luego cambiamos el valor alpha (_transparencia_) dependiendo del valor de _opacity_. Además, si el objeto está entrando (véase que su valor Z es mayor o igual a 90 unidades), le aplicamos una transición de entrada bonita, para que no aparezcan los planos de la nada.

Ahora solo falta juntar los dos programas para hacer Shader como tal:

```javascript
    //Cargamos el shader
    var material = new THREE.RawShaderMaterial({
        uniforms: {
            opacity: { value: 1.0 },
            texture: { value: null }
        },
        transparent: true,
        vertexShader: document.querySelector("#vertexShader").innerText,
        fragmentShader: document.querySelector("#fragmentShader").innerText
    });
```

Creamos el objeto y al escenario:

```javascript
    plane = new THREE.Mesh(geometry, material);
    plane.frustumCulled = false; //Asi no desaparece el tema
    scene.add(plane); //Todo listo
```
Con esto estamos casi listos para renderizar. Solo falta cargar las texturas. Esto con texture loader es fácil. [Linea 243](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L243) No hace falta explicar.

## Hora de renderizar

```javascript
    function render(a) {
        //Solo renderizamos si tenemos la ventana enfocada
        if(focused) requestAnimationFrame(render);

        if(lastA === null) lastA = a;
        var delta = (a - lastA) / 1000;
        var z = -camera.position.z;

        if(-5 <= z && z < 50) {
            material.uniforms.opacity.value = z / 50;
        } else if(z > max - 50 && z <= width + height + 50) {
            material.uniforms.opacity.value = (max - z) / 50;
        } else if(z > max + 50) {
            camera.position.z = 5;
        } else if(z < -5) {
            camera.position.z = -(max + 50);
        } else if(material.uniforms.opacity.value !== 1) {
            material.uniforms.opacity.value = 1;
        }
        material.uniforms.opacity.value = Math.max(0, material.uniforms.opacity.value);
        camera.position.z += delta * motion;

    	renderer.render(scene, camera);
    	...
```

La API de Javascript nos dice que para renderizar debemos usar la función `requestAnimationFrame` que llamará a `render` cada vez que vaya a pintar la página (_V-Sync on forzosamente_). `delta` es un valor que indica cuanto tiempo ha pasado desde el anterior frame y el actual, se usa para las animaciones y el cómputo de las físicas (_que aquí no hay_). Ahora entra en juego el efecto que tiene de cuando empieza va apareciendo todo con una transición y cuando se sale del escenario, también. Además de cuando ya hemos llegado al límite, tenemos que colocar la cámara al principio (o al final). `camera.position.z += delta * motion;` desplaza la cámara según los FPS, para que siempre parezca que se mueve a la misma velocidad (_ahi va el delta_). La última linea renderiza como tal el escenario.

Ya tenemos todo renderizándose.

## El teclado
Para cambiar la textura, usamos las teclas 1-9 del teclado, las de encima de las teclas de texto, no el teclado numérico. La [línea 319](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L319) contiene todo el manejo de eso. También si aprietas F, se (des)activa la pantalla completa. Esto último necesita un truco para que el rectángulo estático de la parte de arriba a la izquierda se quede bien.

La [linea 359](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L359) solo tiene sentido si en la URL añadimos al final `#manualMove`. Con eso, la cámara se moverá si aprietas las flechas de arriba y abajo.

## Cambio del tamaño
Si se cambia el tamaño de la ventana, eso hay que manejarlo para que todo se vea bien. La [linea 364](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L364) hace eso mismo.

## Cargando una foto del usuario como textura
Linea 379

```javascript
    document.querySelector('#customImg').addEventListener('change', function() {
        if(this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                textureLoader.load(e.target.result, function(texture) {
                    if(textures.custom) textures.custom.dispose();
                    textures.custom = texture;
                    material.uniforms.texture.value = texture;
                });
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
```

Usando la API del DOM (el documento de la página web), esperamos a que el usuario seleccione una foto, cuando lo haya hecho, le decimos al navegador que queremos leer el archivo (`FileReader`). Cuando haya leído (`reader.onload`) es cuando tiene que decirle a Three.js que cargue la textura y la ponga como la visible. Finalmente le indicamos que lea la imagen (`reader.readAsDataURL`). `e.target.result` contiene una URL a la imagen (_pero no al archivo local_).

## Hacer una foto desde la webcam
Esto es lo mas complicado y además, no funciona en todos los navegadores. Usa una API diseñada para WebRTC y miles de historias que no acabo de comprender. Pero el tema es que funciona. En la [línea 262](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L262) podéis ver como creo dos variables, uno `video` (que contendrá un objeto `<video>`) y `videocanvas` (que tiene un canvas al que renderizar un frame de `video` y cargarlo como textura).

Hora de ubicarse en [la linea 392](https://github.com/melchor629/melchor629.github.com/blob/master/eugl.html#L392). Primero pido al navegador si puedo obtener video de la Webcam con `navigator.getUserMedia`. Si me lo concede, entonces empezamos a crear el objeto `<video>` donde estará el video que provenga de la webcam, además de añadirlo al documento para que el usuario pueda ver una vista previa de la foto. Se hace una cuenta atrás de 3 segundos. **Momento troll** si añadimos al final de la URL `#troll` (o `#algo&troll` si ya había algo después de #), el usuario no verá una vista previa de la webcam, útil para trolear a la gente.

Cuando pasan los 3 segundos, se hace la magia: `videocanvas.getContext('2d').drawImage(video, 0, 0, 512, 512);` Esta línea nos renderiza un fotograma en el canvas y posteriormente, con `videocanvas.toDataURL('image/png')` convertiremos a una URL de una imagen PNG que cargaremos con Three.js y seleccionaremos para que se muestre.

Es una curiosa forma de obtener una foto de la webcam, con muchas lineas de código, pero que realmente funciona. El único problema es que no consigo que deje de obtener video de la webcam, y para ello hay que recargar la página. Les dejo para que me envíen un _Pull Request_ con el arreglo, o ya veré que hago.

## #debug
Si se añade al final de la URL `#debug` (o `#algo&debug` si ya había algo), entonces veréis mas información. Cosas que he usado yo para hacer pruebas.

## Conclusión
Este interesante experimento funciona incluso en Android (_en mi movil va de lujo_). Si veis algún fallo o queréis añadir algo, podéis decírmelo y si aportáis código mejor :D

Espero que hayáis aprendido algo con este experimento, tanto como yo haciéndolo.
