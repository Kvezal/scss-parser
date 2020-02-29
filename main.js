const params = require('./params');
const parser = require('./parser');
const fs = require('fs');

const scssList = parser.transformFileToScssList(params.filePathList);

// scssList.forEach(scss => {
//     fs.writeFileSync(`scss/${scss.fileName}.scss`, scss.fileContent);
// })

console.log(scssList);
