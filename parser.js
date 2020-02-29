const fs = require('fs');

const scssRegExps = {
  selector: '[\\w-,.:\\s()]*',
  property: '[\\w-:\\s;\'"%()]*',
};

let selectDeep;

function getScssList(fileContent) {
  const scssRegExp = getRegExp();
  const scssListMatches = fileContent.match(scssRegExp);
  if (scssListMatches === null) {
    return null;
  }
  const scssList = scssListMatches.map(scss => {
    const value = {
      fileName: getSelector(scss),
      fileContent: scss,
      children: null,
    };
    if (scss.search('&') !== -1) {
      let content = value.fileContent.replace(value.fileName, '');
      content = content.slice(1, content.length - 1).trim().replace('^;', '');
      value.children = getScssList(content);
    }
    return value;
  });
  return scssList;
}

function getSelector(scss) {
  const preparedScss = scss.replace(/[;\s]*/ig, '');
  const selectorRegExp = new RegExp(`&?${scssRegExps.selector}`, 'i');
  return preparedScss.match(selectorRegExp)[0];
}

function getRegExp() {
  return RegExp(`\\S(&?${scssRegExps.selector})*{${scssRegExps.property}${getDeepPropertyRegExp(selectDeep)}}`, 'ig');
}

function getDeepPropertyRegExp(deep) {
  return (deep <= 1)
    ? `(&${scssRegExps.selector}{?${scssRegExps.property}}\\s*)*`
    : `(&${scssRegExps.selector}{?${scssRegExps.property}${getDeepPropertyRegExp(deep - 1)}}\\s*)*`;
}

module.exports = {
  setDeep: deep => {
    selectDeep = deep;
  },
  transformFileToScssList: fileName => {
    const fileContent = fs.readFileSync(fileName).toString();
    console.log(fileName);
    return getScssList(fileContent);
  },
}
