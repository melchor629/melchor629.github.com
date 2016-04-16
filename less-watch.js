var fs = require('fs');
var cp = require('child_process');

var toConsole = function(e, stdout, stderr) {
    if(e) console.error('Ha habido un error: ' + e);
    if(stdout) console.log(stdout);
    if(stderr) console.error(stderr);
};

fs.watch('./_less/', function(a, b) {
    var ext = b.substr(b.lastIndexOf('.') + 1);
    if(ext === 'less') {
        var fCss = b.substr(0, b.lastIndexOf('.')) + '.css',
            from = './_less/' + b, to = './assets/css/' + fCss,
        pr = cp.exec('lessc --clean-css ' + from + ' ' + to, toConsole);
        console.log('Compilando \'' + from + '\' a \'' + to +'\'');
    }
});
