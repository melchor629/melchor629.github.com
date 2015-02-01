---
title: Un árbol de navidad para tu terminal
date: 2014-12-12 23:37:55
tags: ['terminal', 'ncurses', 'libncurses', 'curses', 'linux', 'mac os x', 'navidad', 'arbol']
---
En estas fechas tan señaladas como son la navidad (_y los ejercicios de programación de la universidad_) hacen de este post algo (_ciertamente_) bonito:

![A]({{ site.baseurl }}/assets/img/posts/arbolDeNavidadCurses.png)

¿A que esta bonito? Pues ahi va el código:

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="show">
            <h4 class="panel-title">
                <a data-toggle="collapse" class="collapsed" data-parent="#accordion" href="#code" aria-expanded="false" aria-controls="code">Mostrar/Ocultar código</a>
            </h4>
        </div>
        <div id="code" class="panel-collapse collapse" role="tabpanel" aria-labelledby="show">
            <div class="panel-body">
{% highlight C++ %}
#include <iostream>
#include <curses.h>
#include <signal.h>

static void finish(int sig);
void arbolDeNavidad();

int main() {
    //Si cerramos el programa a lo bestia, que la terminal
    //vuelva a tener el mismo aspecto que antes...
    signal(SIGINT, finish);

    initscr();
    keypad(stdscr, true);
    nonl();
    cbreak();
    echo();

    if(has_colors()) {
        start_color();

        //Asignación de olores, generalmente lo que necesitamos. El par 0 no
        //puede ser redefinido
        init_pair(1, COLOR_RED,    COLOR_BLACK);
        init_pair(2, COLOR_GREEN,  COLOR_BLACK);
        init_pair(4, COLOR_YELLOW, COLOR_BLACK);
        init_pair(3, COLOR_BLUE,   COLOR_BLACK);
        init_pair(5, COLOR_CYAN,   COLOR_BLACK);
        init_pair(6, COLOR_MAGENTA,COLOR_BLACK);
        init_pair(7, COLOR_WHITE,  COLOR_BLACK);
    } else {
        endwin();
        std::cout << "Esta terminal no permite el uso de colores." << std::endl;
        std::cout << "Por tanto el programa se cerrará...\n";
        finish(0);
    }

    arbolDeNavidad();

    getch();
    finish(0);
}

static void finish(int sig) {
    endwin();
    exit(0);
}

///////////////////////////////////////////////////////
/// Aqui van las funciones para el arbol de navidad ///
///////////////////////////////////////////////////////

void colocarCursor(unsigned fila, unsigned filas) {
    move(LINES/2 - filas/2 + fila - 2, COLS/2 - fila);
}

void imprimirArbol(unsigned filas) {
    attrset(COLOR_PAIR(2));
    for(unsigned i = 1; i <= filas; i++) {
        colocarCursor(i, filas);
        for(unsigned j = 0; j < 2*i-1; j++)
            addch('*');
    }

    attrset(COLOR_PAIR(1));
    colocarCursor(filas+1, filas);
    for(unsigned i = 0; i < filas - 1; i++) addch(' ');
    addstr("| |");
    colocarCursor(filas+2, filas);
    for(unsigned i = 0; i < filas; i++) addch(' ');
    addstr("| |");
}

void imprimirMarco() {
    static unsigned count;
    for(int y = 0; y < LINES; y++) {
        attrset(COLOR_PAIR((count + y) % 4 + 3));
        mvaddch(y, 0, '|');
        mvaddch(y, COLS - 1, '|');
    }

    for(int x = 0; x < COLS; x++) {
        attrset(COLOR_PAIR((count + x) % 4 + 3));
        mvaddch(0, x, '~');
        mvaddch(LINES - 1, x, '~');
    }

    count++;
    refresh();
    usleep(500000);
}

void arbolDeNavidad() {
    unsigned altura;

    addstr("Altura del árbol: ");
    scanw("%u", &altura);

    move(0, 0);
    for(int i = 0; i < COLS; i++) addch(' ');
    imprimirArbol(altura);

    //Bucle infinito para mostrar el marco cambiante. Se sale con CTRL+C
    while(true) {
        imprimirMarco();
    }
}

{% endhighlight %}
            </div>
        </div>
    </div>
</div>