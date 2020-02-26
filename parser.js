const fs = require('fs');

class ScssTransformer {
  fileContent = '';
  scssContent = [];

  constructor(fileContent) {
    this.fileContent = fileContent;
    this.getBracketPositions(fileContent);
    // this.scssContent = this.getScssContent();
    console.log(this.scssContent);
  }

  // getScssContent() {
  //   if (this.openBracketArray.length !== this.closeBracketArray.length) {
  //     throw new Error('Invalid SCSS file content!');
  //   }
  //   return this.openBracketArray.map((item, index) => {
  //     const selector = this.getSelector(index);
  //     const value = this.getScssValue(index);
  //     return {
  //       selector,
  //       value,
  //     }
  //   })
  // }

  getSelector(openBracketIndex, closeBracketIndex) {
    return this.fileContent.slice(closeBracketIndex + 1, openBracketIndex).trim();
  }

  getScssValue(openBracketIndex, closeBracketIndex) {
    return this.fileContent.slice(openBracketIndex + 1, closeBracketIndex);
  }

  getBracketPositions(content) {
    let parentLevel = 0;
    let isSelectorWithSeveralAmpersand = false;
    let openBracketIndex = 0;
    let closeBracketIndex = 0;
    let selector = '';

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
        openBracketIndex = i;        
        selector = this.getSelector(openBracketIndex, closeBracketIndex);
        continue;
      } 
      if (hasCloseBracket) {
        closeBracketIndex = i;
        const value = this.getScssValue(openBracketIndex, closeBracketIndex);
        this.scssContent.push({
          selector,
          value,
        });
        continue;
      }
    }
  }
}

module.exports.scssToObject = (fileName) => {
  const fileContent = fs.readFileSync(fileName).toString();
  const scssTransformer = new ScssTransformer(fileContent);
};
