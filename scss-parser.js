const params = require('./params');
const parser = require('./parser');

parser.scssToObject(params.filePathList);
console.log(params);
