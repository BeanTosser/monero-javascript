import fs from "fs";
import readline from "readline";

var lineReader = readline.createInterface({
  input: fs.createReadStream('./src/test/TestMoneroWalletCommon.js')
});

let getNestedParens = function(line, startIndex){
  let startParenIndex, endParenIndex;
  let parenNestDepth = 0;
  for(let i = startIndex; i < line.length; i++){
    if(line[i] === "(") {
      if(startParenIndex === undefined){
        startParenIndex = i;
      }
      parenNestDepth++;
    } else if(line[i] === ")"){
      parenNestDepth--;
      if(parenNestDepth === 0){
        endParenIndex = i;
        break;
      }
    }
  } 
  let parenSection = line.slice(startParenIndex+1, endParenIndex);
  console.log("parenString: " + parenSection);
  return ({startParenIndex: startParenIndex, endParenIndex: endParenIndex, parenSection: parenSection});
}

let compareCount = 0;

lineReader.on('line', function (line) {
  
  //Find index of ".compare" if it exists
  const compareIndex = line.search(/\.compare/);
  if(compareIndex !== -1){
    const firstCompareValueIndex;
    compareCount++;
    console.log(" ");
    console.log(" ");
    console.log('Line from file:', line);
    //This line contains a BigInteger compare function. replace it!
    //See if the line starts with "assert"
    let assertIndex = line.search(/((if \()|(assert))/);

    let compareParensInfo = getNestedParens(line, compareIndex);
    if(assertIndex !== -1){
      console.log("assert index: " + assertIndex);
      
      
      
      
      
      // Is this an "assert.equal"?
      if(line.search(/assert\.equal/)) {
        
      } else {
        firstCompareValueIndex = line.search(/[^, ]+\.compare/);
      }
      console.log("firstCompare value: " + line.slice(firstCompareValueIndex, compareParensInfo.startParenIndex));
      
      
      
      
      // Extract the content of the assert/if statement parens into separate string
      let assertParensInfo = getNestedParens(line, assertIndex);
      console.log("assertParensString: " + assertParensInfo.parenSection);
      console.log("assert parens start: " + assertParensInfo.startParenIndex);
      let assertSectionReplacement = "BigIntegerCompare(" + line.slice(firstCompareValueIndex, compareIndex) + ", " + line.slice(compareParensInfo.startParenIndex+1, compareParensInfo.endParenIndex) + ")";
      console.log("assert section replacement: " + assertSectionReplacement);
    } 
    console.log("Found " + compareCount + " instances of .compare");
    
  }

});
