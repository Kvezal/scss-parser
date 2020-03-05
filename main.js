const fs = require('fs');

const inputParams = require('./input-params');
const parser = require('./parser');


const scssList = parser.transformFileToScssList(inputParams.filePathList);

// scssList.forEach(scss => {
//     fs.writeFileSync(`scss/${scss.fileName}.scss`, scss.fileContent);
// })

fs.writeFileSync('output.json', JSON.stringify(scssList));
// fs.writeFileSync('output.json', scssList);

