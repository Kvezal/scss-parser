const fs = require('fs');

const params = require('./params');
const scssRegExps = require('./regexps');


function getScssList(fileContent, parent = null) {
  const scssListMatches = fileContent.match(scssRegExps.BASE_PARSER);
  if (scssListMatches === null) {
    return null;
  }
  const scssList = scssListMatches.map(scss => {
    let selector = getSelector(scss);
    if (parent) {
      selector = replaceAmpersand(selector, parent.selector);
    }
    const type = getSelectorType(selector);
    const value = {
      selector,
      fileName: getFileName(selector),
      dir: getDirName(selector, type),
      type,
      fileContent: scss,
      children: null,
      // parent,
    };
    if (scss.search('&') !== -1) {
      let content = value.fileContent.replace(value.fileName, '');
      content = content.slice(1, content.length - 1).trim().replace('^;', '');
      value.children = getScssList(content, value);
    }
    return value;
  });
  return scssList;
}

function getSelector(scss) {
  const preparedScss = scss.replace(/[;\s]*/ig, '');
  const selectorRegExp = new RegExp(`${scssRegExps.PARENT_SELECTOR}`, 'i');
  return preparedScss.match(selectorRegExp)[0];
}

function replaceAmpersand(selector, parentSelector) {
  return selector.replace(/&/gi, parentSelector);
}

function getFileName(selector) {
  return selector.replace('.', '');
}

function getDirName(selector, selectorType) {
  const dirNameMap = new Map([
    [params.selectorType.MODULE, () => selector.replace(/./g, '')],
    [params.selectorType.ELEMENT, () => selector.match(/__[a-z0-9]*/ig).pop()],
    [params.selectorType.MODIFICATOR, () => selector.match(/_[a-z0-9]*/ig).pop()],
    [params.selectorType.PSEUDO, () => null],
  ]);
  return dirNameMap.get(selectorType)();
}

function getSelectorType(selector) {
  const isModificator = selector.search(scssRegExps.selectorType.MODIFICATOR) !== -1;
  if (isModificator) {
    return params.selectorType.MODIFICATOR;
  }
  const isElement = selector.search(scssRegExps.selectorType.ELEMENT) !== -1;
  if (isElement) {
    return params.selectorType.ELEMENT;
  }
  const isPseudo = selector.search(scssRegExps.selectorType.PSEUDO) !== -1;
  if (isPseudo) {
    return params.selectorType.PSEUDO;
  }
  return params.selectorType.MODULE;
}

module.exports.transformFileToScssList = fileName => {
  const fileContent = fs.readFileSync(fileName).toString();
  return getScssList(fileContent);
};
