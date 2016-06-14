//jshint esversion: 6
const fs = require('fs');
const cp = require('child_process');

const toConsole = (e, stdout, stderr) => {
    if(e) console.error('Ha habido un error: ' + e);
    if(stdout) console.log(stdout);
    if(stderr) console.error(stderr);
};

const dir = '../_less/';
const outDir = '../assets/css/';
fs.watch(dir, function(a, b) {
    var ext = b.substr(b.lastIndexOf('.') + 1);
    if(ext === 'less') {
        var fCss = b.substr(0, b.lastIndexOf('.')) + '.css',
            from = dir + b, to = outDir + fCss,
        pr = cp.exec('lessc --clean-css ' + from + ' ' + to, toConsole);
        console.log('Compilando \'%s\' a \'%s\'', from, to);
    }
});
