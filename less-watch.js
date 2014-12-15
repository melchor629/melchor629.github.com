var fs = require('fs');
var cp = require('child_process');

fs.watch('./_less/', function(a, b) {
    var ext = b.substr(b.lastIndexOf('.') + 1);
    if(ext === 'less') {
        //lessc -x ./_less/b ./assets/less/b
        var fCss = b.substr(0, b.lastIndexOf('.')) + '.css';
        var pr = cp.exec('lessc ' + ['-x', './_less/' + b, './assets/less/' + fCss].join(' '));
        console.log('Compilando \'./_less/' + b + '\' a \'./assets/less/' + fCss +'\'');
        pr.stdout.addListener('data', function(d) { console.log(d) });
    }
});