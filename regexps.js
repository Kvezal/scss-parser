const inputParams = require('./input-params');


const SELECTOR_BASE = `[\\w-,.:\\s()]*`;
const PARENT_SELECTOR = `\\S(&?${SELECTOR_BASE})*`;
const CHILD_SELECTOR = `&${SELECTOR_BASE}`;
const PROPERTY = `[\\w-:\\s;\'"%()]*`;

const selectorType = {
  ELEMENT: /[&a-z0-9]_{1,2}[a-z0-9]/ig,
  MODIFICATOR: /[&a-z0-9]_[a-z0-9]/ig,
  PSEUDO: `:`,
}

const BASE_PARSER = function getDeepBaseParserRegExp(deep) {
  if (deep === inputParams.deep) {
    return RegExp(`${PARENT_SELECTOR}{${PROPERTY}${getDeepBaseParserRegExp(deep - 1)}}`, 'ig');
  } else if (deep > 1) {
    return `(${CHILD_SELECTOR}{${PROPERTY}${getDeepBaseParserRegExp(deep - 1)}}\\s*)*`;
  }
  return `(${CHILD_SELECTOR}{${PROPERTY}}\\s*)*`;
}(inputParams.deep);

const PARIFICATION_PARSER = function getDeepParificationParser(deep) {
  if (deep === inputParams.deep) {
    return RegExp(`(${CHILD_SELECTOR}{${PROPERTY}${getDeepParificationParser(deep - 1)}})`, 'ig');
  } else if (deep > 1) {
    return `(${CHILD_SELECTOR}{${PROPERTY}${getDeepParificationParser(deep - 1)}}\\s*)*`;
  }
  return `(${CHILD_SELECTOR}{${PROPERTY}}\\s*)*`;
}(inputParams.deep);

module.exports = {
  SELECTOR_BASE,
  PARENT_SELECTOR,
  CHILD_SELECTOR,
  PROPERTY,
  selectorType,
  BASE_PARSER,
  PARIFICATION_PARSER,
};




// (&[\w-,.:\s()]*{[\w-:\s;'"%()]*}\s*)*