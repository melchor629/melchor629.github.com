---
title: Web hosting con Docker
author: Melchor Alejo Garau Madrigal
thumb: hosting-docker.png
date: 2018-02-4 12:30:00 +0100
layout: nothing
---

 > Espera. Un momento. ¿Web hosting con qué?

Hoy vengo a hablaros sobre un reciente experimento de web hosting, semi-automatizado,
usando la nueva tecnología en auge de los **contenedores**. Pero antes de entrar en
detalles, vamos a ir explicando poco a poco todo.

# Contenedores (Docker)

En el mundo del software, hay varias formas de virtualizar. Con "_virtualizar_" nos
referimos al _método por el cual un software se ejecuta en un entorno que no es real
del todo_. Digamos, por ejemplo, una máquina virtual. Seguro que habréis usado una. Y
si no es así, en Wikipedia [hay info][1] :) No es mas que una forma de emular un _algo_
usando software, donde ese _algo_ es un ordenador, es hardware en las máquinas virtuales.
Otras formas de virtualizar sería la de los contenedores. Lo que tienes real es el
hardware y el sistema operativo, pero lo demás (archivos, programas, redes...) queda
completamente aislado. El software en un contenedor solo ve lo que viene en su ISO y
lo que tu decidas compartir con él.

Hay varias plataformas sobre la que crear y ejecutar contenedores. Entre ellas está
[Linux Containers (LXC)][2] de Canonical (creadores de Ubuntu) y [Docker][3]. El que
más éxito tiene, y el mas reciente. Docker lo puedes usar no solo para tu propio ordenador,
sino también en algunas plataformas Cloud [ofrecen][4], que permiten la ejecución de
contenedores Docker o [parecidos][5]. En muchas empresas, se está usando la combinación
de máquinas virtuales (en servidores especializados), con contenedores para realizar
un flujo de trabajo moderno, fluido y fácilmente mantenible y escalable (ahora
entraremos en terminos específicos). Y no hablo solo de empresas de desarrollo
software, seguramente habrá empresas que incluyan este tipo de sistemas para agilizar
algunas partes de su flujo de trabajo.

¿Qué hace los contenedores tan especiales? Los **contenedores** toman como base una **imagen**,
la ejecutan en su entorno aislado y no dependen del sistema operativo ya que la imagen
tiene todo lo necesario para ejecutarse. Las imágenes son como las ISO de los contenedores,
tiene lo necesario para ejecutarse, pero no puedes modificarla. Puedes instalar muchos
Windows 10 con tu ISO, pero no vas a poder modificarla. La imagen tiene el mismo comportamiento,
puedes ejecutar muchos contenedores usando la misma imagen, pero la imagen siempre será
la misma. Otro detalle interesante sobre las imagenes es que, por decirlo de alguna forma,
se van montando como en capas. Es decir, uno parte de la imagen básica que es una vacía,
y rellena con cosas (de ahi salen las imagenes Alpine Linux, Debian, Ubuntu, etc.), y
otra persona puede coger esa imagen y meterle nuevas cosas. Cada vez que se hace una
modificación, la nueva imagen no ocupa todo el espacio, si no solo lo que se ha modificado
y añadido. Eso permite ahorrar espacio aunque el rendimiento se ve reducido. Un **contendor**
al fin y al cabo es una imagen en ejecución, con los parámetros que se le haya especificado.
Por último, uno siempre puede persistir (dejar persitente cambios realizados en el contenedor)
mediante **volumenes**. Éstos permiten almacenar en el disco duro real archivos que dejan
los programas que se ejecutan en el contenedor. Pueden ser un disco virtual o puede ser
una carpeta real del dispositivo de almacenamiento. Por último, las **redes** de los
contenedores son virtuales, es decir, son propias y solo se pueden ver entre ellas. Tu
solo serias capaz de ver aquellas que tu publicaras. Aunque también está la versión de
no crear una red de este tipo (_host network_).

Este tipo de aislamiento permite que los contenedores se puedan ejecutar en multiples
servidores distribuidos (clúster) y que crean que solo hay un ordenador y todos están ahí.
Además permite que un contenedor se duplique para su ejecución en el cluster para dar mejor
respuesta a las peticiones y que parezcan ser solo un programa en ejecución (escalabilidad y
alta disponibilidad). En cuestión de segundos, un contenedor puede ponerse en ejecución o
parar. A diferencia de las máquinas virtuales, que requieren de cierto tiempo para encenderse
o apagarse, porque el sistema operativo tiene que arrancar o parar.

# Web hosting

Todos sabemos que es el web hosting. Y uno hecho por uno mismo es mas barato que alquilar
varios _hostings_ para las diversas webs. Por lo que, ¿por qué no montarse uno, uno mismo?
Y si puede ser, lo mas automatizado posible, ¿no? Aqui es cuando viene el poder de los
**contenedores**.

**¿Cual es la idea?** Tener un sistema que, dependiendo del dominio al que acceda, me
muestre una web u otra, y que además (opcionalmente) gestione los certificados SSL para
poder aprovecharse al máximo de HTTPS y la seguridad en la web. Y lo más importante, que
al añadir una web nueva, automaticamente prepare todo el software necesario para que esté
disponible la nueva web y se le prepare un certificado SSL para su funcionamiento.

**¡Manos a la obra!**

## Requisitos para el hosting

Necesitamos un servidor Linux (CentOS, Ubuntu o RHEL a poder ser). Para aprovechar
al máximo Docker, debe ser Linux. Ni macOS ni Windows.

Instalar [Docker CE][6] o [Docker EE][7] en el servidor y [docker-compose][15].

Instalar un servidor FTP, como `proftpd`. Recomiendo configurarlo para que use `sftp`
como método de acceso a los archivos, ya que `ftps` requiere certificados y puede ser caro.

Hacer un hueco en el dispositivo de almacenamiento para colocar todas las webs.

 > **Observación**: A partir de ahora, voy a suponer que ya sabes algo de [Docker][3],
 del a distro que has escogido y de Linux.

## Configuración del sistema base

El sistema base es lo que se encargará de publicar o quitar los contenedores que publiquen
una web, de gestionar los certificados, y de tener algunos servicios básicos. Inicialmente
solo tendremos, como servicios, un sistema gestor de base de datos [MariaDB][8] (MySQL),
[phpmyadmin][9] y `whoami` (pequeña web para hacer pruebas).

Lo primero es tener un sistema automatizado que al ejecutar un contenedor publique su servicio
y cuando se pare, lo _despublique_ (probablemente haya una mejor forma de decir eso). Para
ello, usaremos la imagen [nginx-proxy][10]. Es un servidor web [nginx][11] que actua
como _proxy inverso_ y que tiene además, [docker-gen][12] para detectar cambios en los
contenedores y generar archivos conforme a ello. Para que el sistema funcione, `nginx-proxy`
requiere dos cosas: publicar un servicio en un puerto y poner la variable de entorno `VIRTUAL_HOST`
al dominio (o dominios separados por coma `,`). Pero, ¿que es un proxy inverso? Un servidor
que actúa como _proxy inverso_ no es mas que uno que se interpone entre el cliente y el
servidor real, y realiza la acción correspondiente. En este caso, mira con qué dominio
estás accediendo al servidor web y redirecciona la petición a la web real (contenedor).

Para generar los certificados SSL, usaremos [letsencrypt-nginx-proxy-companion][13]. Este
contenedor usa el servicio [Let's Encrypt][14] para ofrecer certificados SSL gratuitos (y
de calidad) para cualquier web que, además de cumplir con lo anterior, añada dos variables de
entorno nuevas: `LETSENCRYPT_HOST` que contendrá lo mimso que `VIRTUAL_HOST`, y `LETSENCRYPT_EMAIL`
con un email (del webadmin o del que lleva la web).

Ahora vayamos con [MariaDB][8]. El contenedor requiere como mínimo dar una contraseña para
el usuario `root` (al dios todo poderoso del SGBD). Eso se hace con la variable de entorno
`MYSQL_ROOT_PASSWORD`. Y también necesitamos un volumen para almacenar los archivos del
servidor. En [esta guía][18] de Docker, se habla sobre los distintos tipos de almacenamiento.
En mi caso, he escogido `bind mounts`, _y no solo para la base de datos_.

Para [phpmyadmin][9], como es un contenedor y tiene una web, tenemos que poner varias variables
de entorno: `VIRTUAL_HOST` con el dominio del host y `PMA_ABSOLUTE_URI` con ese mismo dominio
pero con `http://` o `https://` delante, `MYSQL_ROOT_PASSWORD` la misma contraseña de antes
puesta en [MariaDB][8], y `PMA_HOST` que será el nombre del contenedor (luego quedará claro).

Para que todo vaya perfecto, usaremos una red propia. Yo lo he llamado `dbnet`. Y como
uso `docker-compose`, para el resto de contenedores, la red es `nginxproxy_dbnet`. El nombre
viene dado por el nombre de la carpeta + _ + nombre de la red: `nginxproxy` es el nombre de
la carpeta, y `dbnet` el nombre de la red → `nginxproxy_dbnet`.

`docker-compose` permite definir varios contenedores de forma rápida y sencilla, y gestionarlos
fácilmente.

Ahi va el `docker-compose.yml`:

```yaml
version: '2'

services:
  #Proxy inverso + docker-gen
  nginx-proxy:
    image: jwilder/nginx-proxy
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DEFAULT_HOST=default.local #Esta variable de entorno dice cual es el contendor por defecto
      - ENABLE_IPV6=true #IPv6, espero pronto poderlo usar ;)
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./my_proxy.conf:/etc/nginx/conf.d/my_proxy.conf:ro #Configuración extra
      - "/etc/nginx/vhost.d/"
      - "/usr/share/nginx/html"
      - "/etc/nginx/certs"
    networks:
      - dbnet

  #Generador de certificados con Let's Encrypt
  letsencrypt-companion:
    restart: always
    image: jrcs/letsencrypt-nginx-proxy-companion
    container_name: letsencrypt-nginx-proxy-companion
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    volumes_from:
      - "nginx-proxy"
    depends_on:
      - "nginx-proxy"

  #Máquina de pruebas, tiene el domonio whoami.local
  #Se puede probar con curl -H "Host: whoami.local" tuservidor.es
  whoami:
    image: jwilder/whoami
    environment:
      - VIRTUAL_HOST=whoami.local
    networks:
      - dbnet
    depends_on:
      - "letsencrypt-companion"

  #Servidor de base de datos
  mariadb:
    image: mariadb
    environment:
      - MYSQL_ROOT_PASSWORD=UNA-CONTRASEÑA #Pon una :)
    volumes:
      - /var/lib/mysql:/var/lib/mysql #Puedes cambiar la ruta (la primera)
    networks:
      - dbnet

  #PHPMyAdmin
  #El host es privado, para que sea mas "dificil" acceder
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    restart: always
    environment:
      - VIRTUAL_HOST=phpmyadmin.local
      - PMA_ARBITRARY=1
      - "PMA_ABSOLUTE_URI=http://phpmyadmin.local"
      - MYSQL_ROOT_PASSWORD=UNA-CONTRASEÑA
      - PMA_HOST=mariadb
    networks:
      - dbnet
    depends_on:
      - "letsencrypt-companion"
      - "mariadb"

#Nuestra maravillosa red compartida
networks:
  dbnet:
```

**Como extra**, se podria añadir el servidor FTP aqui. Seguramente habrá algo que permita
compartir volumenes de los contenedores por un servidor FTP al igual que [nginx-proxy][10].

Si observais, tengo compartido un fichero con configuración extra para [nginx][11]. Es solo
para que uno pueda subir ficheros de más de 0,5MB (_no tengo claro si era MiB o MB_). Bueno,
ahi va, `my_proxy.conf`:

```
server_tokens off;
client_max_body_size 100m;
```
 > **Nota**: Si hubiera que usar este sistema en un entorno mas descentralizado, este archivo
formaria parte de la imagen, y la base de datos estaria en un volumen virtual de Docker (no
como ahora, que es compartir una carpeta real).

Para levantar todo, solo hace falta ejecutar `docker-compose up -d` estando en el directorio
del `.yml`. También se puede desplegar con `swarm`, aunque requiere prestar atención a la **nota**.

## La base para la web

Ahora es cuando podemos publicar carpetas como servidores web con un contenedor. La idea es
ofrecer una o varias imagenes para el hosting de webs. Eso se puede crear con diversos ficheros
`Dockerfile`, con cada una de las versiones distintas. En el ejemplo que pongo, uso de base
la imagen de `php:5-apache`, un PHP 5.6 con Apache y tomando como base un Debian. Luego le meto
varias extensiones y lo empaqueto en una nueva imagen. Este seria el `Dockerfile`:

```Dockerfile
FROM php:5-apache

RUN apt-get update && apt-get install -y \
        libcurl4-openssl-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && apt-get clean \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include --with-png-dir=/usr/include --with-jpeg-dir=/usr/include \
    && docker-php-ext-install -j$(nproc) gd mysqli curl opcache pdo pdo_mysql mysql \
    && printf "; configuration for php PDO module \n; priority=10; priority=10\nextension=pdo.so" > /usr/local/etc/php/conf.d/docker-php-ext-pdo.ini \
    && a2enmod rewrite expires \
    && rm -rf /var/lib/apt/lists/*; \
# set recommended PHP.ini settings
# see https://secure.php.net/manual/en/opcache.installation.php
    { \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=4000'; \
        echo 'opcache.revalidate_freq=2'; \
        echo 'opcache.fast_shutdown=1'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini
```

Las imágenes se crean con `docker image build -t NOMBRE[:extra-opcional] .` (. es el directorio actual).
Las imágenes suelen llamarse `algo:extra`. Como el de PHP que es `php:5-apache` para denotar
que es la version especial de PHP con PHP 5.6 y Apache. Es opcional lo que viene después de `:`.
En mi caso, solo lo he nombrado sin el `:extra`, en ese caso, Docker le añade `:latest`.

Exactamente, instala las extensiones `gd`, `mysqli`, `curl`, `opcache`, `pdo`, `pdo_mysql` y
el obsoleto `mysql` (_no lo instalaria si no fuera necesario, pero lo he tenido que hacer_ ☹️).
Además, activa los modulos `rewrite` y `expires` de Apache.

Vosotros podéis montar el servidor como queráis, usando PHP7 FPM con nginx o PHP7 con Apache, o lo
que necesitéis. Es muy fácil configurar imágenes para usarlas en la web :) Podéis experimentar
con [la guia de iniciación][19] de Docker

## Web como contenedor

Ahora es cuando podemos empezar a poner webs nuevas. Para mi servidor, sigo los siguientes pasos:

 1. Creo una carpeta donde almacenar todo (en `/home`)
 2. Creo un usuario con `useradd -g www-data -d "CARPETA" -M "NOMBRE_USUARIO"` y
 `echo -e "CONTRASEÑA\nCONTRASEÑA" | passwd "$1" > /dev/null 2>&1`
 3. Me aseguro que toda la carpeta tiene el dueño correcto `chown -R www-data:www-data "CAREPTA"`
 4. Creo el archivo `docker-compose.yml`
 5. Creo un usuario y una base de datos en el servidor de base de datos
 6. Levanto el contenedor con `docker-compose up -d`

A todo esto, hay que tener en el usuario real un usuario y grupo `www-data`. Su id es 33.

El fichero `docker-compose.yml` para una web sin HTTPS:

```yaml
version: '2'

services:
  web: #Puedes ponerle otro nombre aquí, pero mejor que no exista ya
    image: base-apache_php56 #Nombre de la imagen que has creado antes
    environment:
      - VIRTUAL_HOST=une.host.fr #Dominio(s) del host
    volumes:
      - CARPETA:/var/www/html:rw #Carpeta donde está la web
    networks:
      - nginxproxy_dbnet #Nombre de la red que has creado antes

networks:
  nginxproxy_dbnet: #Nombre de la red que has creado antes (again)
    external: true
```

Y si quieres HTTPS:

```yaml
version: '2'

services:
  web-con-ssl: #Puedes ponerle otro nombre aquí, pero mejor que no exista ya
    image: base-apache_php7 #Nombre de la imagen que has creado antes
    environment:
      - VIRTUAL_HOST=paco.es,www.paco.es #Dominio(s) del host
      - LETSENCRYPT_HOST=paco.es,www.paco.es #Lo mismo que arriba
      - LETSENCRYPT_EMAIL=webmaster@paco.es #Correo para Let's Encrypt
      # - HTTPS_METHOD=noredirect #Desactiva el HSTS
    volumes:
      - CARPETA:/var/www/html:rw #Carpeta donde está la web
    networks:
      - nginxproxy_dbnet #Nombre de la red que has creado antes

networks:
  nginxproxy_dbnet: #Nombre de la red que has creado antes (again)
    external: true
```

 > **Observación**: El [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
es un protocolo que fuerza al navegador a usar HTTPS. Se recomienda no deshabilitarlo, pero
en ocasiones, la web no cumple con los requisitos para que pueda estar activo (carga
contenido por HTTP, por ejemplo) y hay que deshabilitarlo para que HTTPS funcione bien y
carguen las webs.

Ahora, ya puedes gestionar tantas webs como quieras, teniendo como base un mismo servidor.
Tan facil como arrancar con `docker-compose up -d` y parar con `docker-compose down`.

Y, si en lugar de esto, usas contenedores con aplicaciones preparadas (como [Jenkins][16]),
ya has visto que es muy fácil de añadir al ecosistema. Solo necesitas un dominio y, para HTTPS,
que el dominio sea real.

## Wordpress y HTTPS con este sistema

Para ahorraros tiempo, si usáis un Wordpress con este sistema y no usáis la imagen de Docker
de Wordpress, tenéis que configurar una cosa para que no tengas un bucle infinito de redirecciones.
En la [wiki de Wordpress][17] tenéis estas lineas que explican como arreglarlo.

## Ejemplo

[http://5.196.74.90](http://5.196.74.90).

# Conclusión

Hacer un ecosistema entero con Docker, puede llevar tiempo, pero a la larga es muy útil porque
facilita el trabajo de cualquiera. El mio es ahora más facil porque no tengo que hacer tantas
cosas para crear una nueva página, y facilita el crear un panel de gestión propio. Además de que
permite adaptar nuevo software que publica un servicio web, o es una aplicación web, de forma
sencilla y sin tener que preocuparse de tener que configurar todo.

El sistema actual está bien, pero sé que no es lo mejor del mundo. El ecosistema se puede mejorar
con el uso de volumenes (no _bind mounts_). También se deberia usar un servidor FTP en un
contenedor. De esta forma, se podria usar el potencial de [Docker swarm][20] e incluso de
[Kubernetes][21].

  [1]: https://en.wikipedia.org/wiki/Virtual_machine
  [2]: https://linuxcontainers.org
  [3]: https://www.docker.com
  [4]: https://cloud.google.com/container-engine/
  [5]: https://www.heroku.com
  [6]: https://www.docker.com/community-edition#/download
  [7]: https://www.docker.com/pricing
  [8]: https://mariadb.com
  [9]: https://www.phpmyadmin.net
  [10]: https://github.com/jwilder/nginx-proxy
  [11]: http://nginx.org
  [12]: https://github.com/jwilder/docker-gen
  [13]: https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion
  [14]: https://letsencrypt.org
  [15]: https://docs.docker.com/compose/install/
  [16]: https://jenkins.io
  [17]: https://codex.wordpress.org/Administration_Over_SSL#Using_a_Reverse_Proxy
  [18]: https://docs.docker.com/storage/
  [19]: https://docs.docker.com/get-started/part2/#dockerfile
  [20]: https://docs.docker.com/get-started/part4/
  [21]: https://kubernetes.io