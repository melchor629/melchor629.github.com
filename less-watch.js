var fs = require('fs');
var cp = require('child_process');

fs.watch('./_less/', function(a, b) {
    var ext = b.substr(b.lastIndexOf('.') + 1);
    if(ext === 'less') {
        //lessc -x ./_less/b ./assets/less/b
        var fCss = b.substr(0, b.lastIndexOf('.')) + '.css';
        var pr = cp.exec('lessc ' + ' --clean-css ./_less/' + b +' ./assets/css/' + fCss, function(e, stdout, stderr) {
            if(stdout) console.log(stdout);
            if(stderr) console.error(stderr);
        });
        console.log('Compilando \'./_less/' + b + '\' a \'./assets/css/' + fCss +'\'');
    }
});