const params = require('./params');
const parser = require('./parser');
const fs = require('fs');

parser.setDeep(params.deep);
const scssList = parser.transformFileToScssList(params.filePathList);

// scssList.forEach(scss => {
//     fs.writeFileSync(`scss/${scss.fileName}.scss`, scss.fileContent);
// })

fs.writeFileSync('output.json', JSON.stringify(scssList));
