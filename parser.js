const fs = require('fs');

const params = require('./params');
const scssRegExps = require('./regexps');


function getScssList(fileContent, parent = null) {
  const scssListMatches = fileContent.match(scssRegExps.BASE_PARSER);
  if (scssListMatches === null) {
    return null;
  }
  const scssList = scssListMatches.map(scss => {
    const value = getScssParams(scss, parent);
    if (scss.search('&') !== -1) {
      // const content = getContent(scss, value.selector);
      // let content = value.fileContent.replace(value.fileName, '');
      // content = content.slice(1, content.length - 1).trim().replace('^;', '');
      value.children = getScssList(value.content, value);
    }
    return value;
  });
  return scssList;
}

function getScssParams(scss, parent = null) {
  let selector = getSelector(scss);
  const type = getSelectorType(selector);
  const selectorWithoutAmpersand = parent ? replaceAmpersand(selector, parent.selector) : selector;
  const fileName = getFileName(selectorWithoutAmpersand);
  const isNotPseudo = type !== params.selectorType.PSEUDO;
  selector = isNotPseudo ? selectorWithoutAmpersand : selector;
  const dir = isNotPseudo ? getDirName(selector, type) : null;
  return {
      selector,
      fileName,
      dir,
      type,
      fileContent: scss,
      children: null,
      content: getContent(scss, selector),
  }
}

function getSelector(scss) {
  const preparedScss = scss.replace(/[;\s]*/ig, '');
  const selectorRegExp = new RegExp(`${scssRegExps.PARENT_SELECTOR}`, 'i');
  return preparedScss.match(selectorRegExp)[0];
}

function getSelectorType(selector) {
  const isPseudo = selector.search(scssRegExps.selectorType.PSEUDO) !== -1;
  if (isPseudo) {
    return params.selectorType.PSEUDO;
  }
  const isModificator = selector.search(scssRegExps.selectorType.MODIFICATOR) !== -1;
  if (isModificator) {
    return params.selectorType.MODIFICATOR;
  }
  const isElement = selector.search(scssRegExps.selectorType.ELEMENT) !== -1;
  if (isElement) {
    return params.selectorType.ELEMENT;
  }
  return params.selectorType.MODULE;
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

function getContent(scss, selector) {
  const content = scss.replace(selector, '');
  return content.slice(1, content.length - 1).trim().replace('^;', '');
}

module.exports.transformFileToScssList = fileName => {
  const fileContent = fs.readFileSync(fileName).toString();
  return getScssList(fileContent);
};
