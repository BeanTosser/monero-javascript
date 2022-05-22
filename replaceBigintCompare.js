import fs from "fs";
import readline from "readline";

let directory = require("node-dir");
const filePath = './src';

directory.files(
  filePath,
  (error, files) => {
    if(error){
      console.log("Error loading files: " + error);
    } else {
      files.forEach(file => {
        let newFileString = "";
        let lineReader = readline.createInterface({
          input: fs.createReadStream(file)
        });
        
        lineReader.on('line', function (line) {
          console.log(line);
          //Find index of ".compare" if it exists
          
          //DEBUG
          let finalLine = "";
             
          const compareIndex = line.search(/\.compare/);
          if(compareIndex !== -1){
            compareCount++;
        
            //This line contains a BigInteger compare function. replace it!
        
            let compareParensInfo = getNestedParens(line, compareIndex);
            
            // Search backwards from compare index to find start of term on the left side of .compare
            let compareLeftTermStartIndex;
            let compareLeftTermParenDepth = 0;
            for(let i = compareIndex - 1; i >= 0; i--){
              if(line[i] === " " || (line[i] === "(" && (compareLeftTermParenDepth === 0 || compareLeftTermParenDepth === undefined))){
                compareLeftTermStartIndex = i+1;
                break;
              }
              if(line[i] === "("){
                compareLeftTermParenDepth--;
              } else if(line[i] === ")"){
                compareLeftTermParenDepth++;
              } else if (/\s/.test(line[i])){
                //Character is a whitespace
                compareLeftTermStartIndex = i+1;
                break;
              }
            }
            
            const compareLeftTerm = line.slice(compareLeftTermStartIndex, compareIndex);
            
            const newCompareStatement = "BigIntegerCompare(" + compareLeftTerm + ", " + compareParensInfo.parenContents+ ")";
            const newLine = line.slice(0, compareLeftTermStartIndex) + newCompareStatement + line.slice(compareParensInfo.endParenIndex + 1, line.length);
            
            // Add the modified line to the modified _file_
            newFileString += newLine + "\n";
            finalLine = newLine;
          } else {
            //Simply copy the line to the new file
            newFileString += line + "\n";
            finalLine = line;
          }
          
          console.log(finalLine);
          console.log("");
          console.log("");
          console.log("");
        
        });
        
        lineReader.on('close', () => {
          console.log("Writing the file!");
          fs.writeFile(filePath, newFileString, (error) => {
            if(error !== null){
              console.log("Error writing file: " + error);
            }
          });
        })
      })
    }
  }
)

let getNestedParens = function(line, startIndex, reverse){
  let startParenIndex, endParenIndex;
  let parenNestDepth = 0;
  if(reverse){
    for(let i = startIndex; i > 0; i++){
      if(line[i] === ")") {
        if(endParenIndex === undefined){
          endParenIndex = i;
        }
        parenNestDepth++;
      } else if(line[i] === "()"){
        parenNestDepth--;
        if(parenNestDepth === 0){
          startParenIndex = i;
          break;
        }
      }
    }
  } else {
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
  }
  let parenContents = line.slice(startParenIndex+1, endParenIndex);
  return ({startParenIndex: startParenIndex, endParenIndex: endParenIndex, parenContents: parenContents});
}

