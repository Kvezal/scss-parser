const fs = require('fs');

class ScssTransformer {
  fileContent = '';
  openBracketArray = [];
  closeBracketArray = [];
  scssContent = [];

  constructor(fileContent) {
    this.fileContent = fileContent;
    this.getBracketPositions(fileContent);
    this.scssContent = this.getScssContent();
    console.log(this.scssContent);
  }

  getScssContent() {
    if (this.openBracketArray.length !== this.closeBracketArray.length) {
      throw new Error('Invalid SCSS file content!');
    }
    return this.openBracketArray.map((item, index) => {
      const selector = this.getSelector(index);
      const value = this.getScssValue(index);
      return {
        selector,
        value,
      }
    })
  }

  getSelector(index) {
    const startSelector = index ? this.closeBracketArray[index - 1] + 1 : 0;
    const finishSelector = this.openBracketArray[index];
    return this.fileContent.slice(startSelector, finishSelector).trim();
  }

  getScssValue(index) {
    const startSelector = this.openBracketArray[index] + 1;
    const finishSelector = this.closeBracketArray[index];
    return this.fileContent.slice(startSelector, finishSelector);
  }

  getBracketPositions(content) {
    let parentLevel = 0;
    let isSelectorWithSeveralAmpersand = false;

    for (let i = 0; i < content.length; i++) {
      const letter = content[i];
      const hasAmpersand = letter === '&';
      const hasOpenBracket = letter === '{';
      const hasCloseBracket = letter === '}';
      const hasParent = parentLevel !== 0;


      if (hasAmpersand && !isSelectorWithSeveralAmpersand) {
        parentLevel++;
        isSelectorWithSeveralAmpersand = true;
        continue;
      }
      if (hasOpenBracket && isSelectorWithSeveralAmpersand) {      
        isSelectorWithSeveralAmpersand = false;
        continue;
      }
      if (hasCloseBracket && hasParent) {
        parentLevel--;
        continue;
      }
      if (hasParent) {
        continue;
      }
      if (hasOpenBracket) {
        this.openBracketArray.push(i);
        continue;
      } 
      if (hasCloseBracket) {
        this.closeBracketArray.push(i);
        continue;
      }
    }
  }
}

module.exports.scssToObject = (fileName) => {
  const fileContent = fs.readFileSync(fileName).toString();
  const scssTransformer = new ScssTransformer(fileContent);
};
