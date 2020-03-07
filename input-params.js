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
};

const flagValues = {
  prefix: getFlagValue(['--prefix', '-p']),
  elementSeporator: getFlagValue(['--elementSeporator', '-e'], '__'),
  modifierSeporator: getFlagValue(['--modifierSeporator', '-m'], '_'),
  filePathList: getFlagValue(['--file', '-f']),
  deep: Number(getFlagValue(['--deep', '-d'])) || 10,
};

module.exports = flagValues;
