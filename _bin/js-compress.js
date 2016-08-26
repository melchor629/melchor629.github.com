//jshint esversion: 6
'use strict';
const UglifyJS = require('uglify-js');
const fs = require('fs');

const list = {};
const dir = '../assets/js/';
fs.watch(dir, function(type, file) {
    if(type === 'change') {
        if(Date.now() - list[file] < 500) return;
        console.log('Compressing %s%s...', dir, file);
        let result = UglifyJS.minify(dir + file);
        fs.writeFile(dir + file, result.code);
        list[file] = Date.now();
    }
});
