//jshint esversion: 6
const UglifyJS = require('uglify-js');
const fs = require('fs');

const list = {};
const dir = '../assets/js/';
fs.watch(dir, (type, file) => {
    if(type === 'change') {
        if(Date.now() - list[file] < 500) return;
        console.log('Compressing %s%s...', dir, file);
        let result = UglifyJS.minify(dir + file);
        fs.writeFile(dir + file, result.code, () => void 0);
        list[file] = Date.now();
    }
});
