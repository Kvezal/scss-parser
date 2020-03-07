const fs = require('fs');

const params = require('./params');
const scssRegExps = require('./regexps');


function getScssList(fileContent, parent = null, level = 0) {
  const scssListMatches = fileContent.match(scssRegExps.BASE_PARSER);
  if (scssListMatches === null) {
    return null;
  }
  return scssListMatches.map(scss => getScssParams(scss, parent, level));
}

function getScssParams(scss, parentSelector = null, level = 0) {
  let selector = getSelector(scss);
  const type = getSelectorType(selector);
  const selectorWithoutAmpersand = parentSelector ? replaceAmpersand(selector, parentSelector) : selector;
  const isNotPseudo = type !== params.selectorType.PSEUDO;
  const fileName = isNotPseudo ? getFileName(selectorWithoutAmpersand) : null;
  selector = isNotPseudo ? selectorWithoutAmpersand : selector;
  const dir = isNotPseudo ? getDirName(selector, type) : null;
  const preferedScssForDeepContent = parentSelector ? scss.replace('&', parentSelector) : scss;
  const deepContent = getDeepContent(preferedScssForDeepContent);
  const currentLevel = parentSelector && isNotPseudo ? level + 1 : level;
  const children = deepContent !== null ? deepContent.map(item => getScssList(item, selectorWithoutAmpersand, currentLevel)) : null;
  return {
    level: currentLevel,
    selector,
    fileName,
    dir,
    type,
    propertyList: getPropertyList(preferedScssForDeepContent, selectorWithoutAmpersand),
    children,
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

function getPropertyList(scss, selector) {
  let content = scss.replace(scssRegExps.PARIFICATION_PARSER, '');
  content = content.replace(selector, '');
  const propertyString = content.replace(/[{}\s]*/ig, '');
  return propertyString.split(';').reduce((propertyList, item) => {
    if (item !== '') {
      const value = item.split(':');
      propertyList.push({property: value[0], value: value[1]});
    }
    return propertyList;
  }, []);
}

function getDeepContent(scss) {
  return scss.match(scssRegExps.PARIFICATION_PARSER);
}

module.exports.transformFileToScssList = fileName => {
  const fileContent = fs.readFileSync(fileName).toString();
  return getScssList(fileContent);
};
