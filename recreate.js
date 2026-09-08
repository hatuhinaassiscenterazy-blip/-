const fs = require('fs');

const indexCode = fs.readFileSync('dist/assets/index-B7s-UXj7.js', 'utf8');
// It's minified React code. I don't need to de-minify it.
// I can just get the whole App.tsx from my context!
