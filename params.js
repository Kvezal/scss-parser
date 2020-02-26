const getFlagValue = (flagNameList, defaultValue = null) => {
  for (let i = 0; i < flagNameList.length; ++i) {
    const flagName = flagNameList[i];
    const flagIndex = process.argv.indexOf(flagName);
    if (flagIndex === -1) {
      continue;
    }
    flagValue = process.argv[flagIndex + 1];
    if (flagValue) {
      return flagValue;
    }
  }
  return defaultValue;
}

// const getFileList = flagNameList => {
//   const flagValue = getFlagValue(flagNameList);
//   const valueWithoutSpace = flagValue.replace(/\s/ig, "");
//   const fileArray = valueWithoutSpace.split(',');
//   return fileArray;
// }

const flagValues = {
  prefix: getFlagValue(['--prefix', '-p']),
  elementSeporator: getFlagValue(['--elementSeporator', '-e'], '__'),
  modifierSeporator: getFlagValue(['--modifierSeporator', '-m'], '_'),
  filePathList: getFlagValue(['--file', '-f']),
};

module.exports = flagValues;
