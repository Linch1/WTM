const path = require('path');
function relativePath( path1, path2) {
  return path.relative(path.dirname(path1),path.dirname(path2));
} 
let relPath = relativePath('/WTM-VIEWS/lol.ts', '/WTM-VISUALS/navbar/ejs/assets/css/style.css');
console.log( relPath );