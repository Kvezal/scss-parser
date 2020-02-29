const fs = require('fs');

function getScssList(fileContent) {
  const scssRegExp = getRegExp();
  const scssList = fileContent.match(scssRegExp)
    .map(scss => ({
      fileName: getSelector(scss),
      fileContent: scss,
    }));
  return scssList;
}

function getSelector(scss) {
  return scss.match(/[a-z-_:0-9.,\s]*/i)[0];
}

function getRegExp() {
  const regExp = {
    selector: '\\S&?[\\w-,.:\\s()]*',
    property: '[\\w-:\\s;\'"%()]*'
  };

  const aaa = `(&[\\w-,.:\\s()]*{?[\\w-:\\s;'"%()]*}\\s*)*`;
  return RegExp(`${regExp.selector}{${regExp.property}${getDeepProperty(3)}}`, 'ig');
  // return RegExp(`\\S${getDeepProperty(5)}`);
}

function getDeepProperty(deep) {
  
  const regExp = {
    selector: '&[\\w-,.:\\s()]*',
    property: '[\\w-:\\s;\'"%()]*'
  };
  if (deep <= 1) {
    return `(${regExp.selector}{?${regExp.property}}\\s*)*`
  }
  return `(&[\\w-,.:\\s()]*{?[\\w-:\\s;'"%()]*${getDeepProperty(deep - 1)}}\\s*)*`
}

module.exports.transformFileToScssList = (fileName) => {
  const fileContent = fs.readFileSync(fileName).toString();
  return getScssList(fileContent);
};


// (?<selector>[.a-z\d-_,\s:]*)
// (?<property>[a-z-]*\s*:\s*[\da-z'";]*)
// (?<subselector>[.a-z\d\-_,\s:&]*)
// (?<selector>[.a-z\d-_,\s:]*)(?<property>[a-z-]*\s*:\s*[\da-z'";]*)(?<subselector>[.a-z\d\-_,\s:&]*)

// (?<selector>[.a-z\d-_,\s:]*){0}(?<property>[a-z-]*\s*:\s*[\da-z'";]*){0}(?<subselector>[.a-z\d\-_,\s:&]*){0}

// (?<selector>[.a-z\d-_,\s:]*)(?<property>[a-z-\d'";\s:]*)(?<subselector>[.a-z\d\-_,\s:&]*)

//(?<selector>[.a-z\d-_,\s:]*){\s*(?<property>[a-z\-]*\s*:\s*[a-z\d'"\-]*;\s*)*((?<subselector>[&.a-z\d\-_,\s:]*)*\s*\k<property>*})*

// (?<selector>[.a-z\d-_,\s:]*)(?<startSelectorValue>[{\s]*)(?<property>[a-z\-]*\s*:\s*[a-z\d'"\-]*;\s*)*(?<endSelectorValue>[}\s]*)*((?<subselector>[&.a-z\d\-_,\s:]*)*\k<startSelectorValue>\k<property>\k<endSelectorValue>)*}*

// ***BASE*** \S(?<selector>[&.a-z\d-_,:\s]*)*\s*{\s*(?<property>[a-z\-]*\s*:\s*[a-z\d'"\-]*;\s*)*}

// [\w-,.:\s&]*{\s*[\w-:\s;]*[&\w-,.:\s]*{?[\w-:\s;]*[\s}]*

// \S[\w-,.:\s()]*{[\w-:\s;]*(&[\w-,.:\s()]*{?[\w-:\s;]*}\s*)*}

// \S[&\w-,.:\s()]*{[\w-:\s;'"%()]*(&[\w-,.:\s()]*{?[\w-:\s;'"%()]*(&[\w-,.:\s()]*{?[\w-:\s;'"%()]*(&[\w-,.:\s()]*{?[\w-:\s;'"%()]*}\s*)*}\s*)*}\s*)*}

