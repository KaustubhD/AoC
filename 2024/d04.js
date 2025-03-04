const fs = require('fs');
const performance = require('perf_hooks').performance;

const inputFilePath = './input.txt';

function readInput() {
  if (!fs.existsSync(inputFilePath)) {
    throw new Error('Please provide an input.txt');
  }
  const data = fs.readFileSync(inputFilePath).toString();
  return data;
}

function parseLinesTo2DArray(dataAsString) {
  return dataAsString.split(/\r*\n/).map(line => line.split(''));
}

function allPossibleDirections(si, sj) {
  const i = parseInt(si, 10), j = parseInt(sj, 10);

  return [
    [
      [i, j], [i, j + 1], [i, j + 2], [i, j + 3] // East
    ],
    [
      [i, j], [i, j - 1], [i, j - 2], [i, j - 3] // West
    ],
    [
      [i, j], [i + 1, j], [i + 2, j], [i + 3, j] // South
    ],
    [
      [i, j], [i - 1, j], [i - 2, j], [i - 3, j] // North
    ],
    [
      [i, j], [i - 1, j + 1], [i - 2, j + 2], [i - 3, j + 3] // North East
    ],
    [
      [i, j], [i - 1, j - 1], [i - 2, j - 2], [i - 3, j - 3] // North West
    ],
    [
      [i, j], [i + 1, j - 1], [i + 2, j - 2], [i + 3, j - 3] // South West
    ],
    [
      [i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3] // South East
    ],
  ];
}

function xDirection(si, sj) {
  const i = parseInt(si, 10), j = parseInt(sj, 10);

  return [
    [
      [i - 1, j - 1], [i, j], [i + 1, j + 1] // '\' direction
    ],
    [
      [i + 1, j - 1], [i, j], [i - 1, j + 1] // '/' direction
    ],
  ];
}

function getWordFromDirectionsArray(data, direction) {
  return direction.reduce((acc, [rowNum, colNum]) => {
    acc += data[rowNum]?.[colNum];
    return acc;
  }, '');
}

function solve(parsedData) {

  let xmasOccurenceCount = 0;
  let x_masOccurenceCount = 0;

  for (const i in parsedData) {
    for (const j in parsedData[i]) {
      if (parsedData[i][j] == 'X') {
        const directions = allPossibleDirections(i, j);
        // console.log(directions);
        for (const direction of directions) {
          let wordInDirection = getWordFromDirectionsArray(parsedData, direction);
          if (wordInDirection == 'XMAS') {
            xmasOccurenceCount++;
          }
        }
      }

      if (parsedData[i][j] == 'A') {
        const directions = xDirection(i, j);
        const word1 = getWordFromDirectionsArray(parsedData, directions[0]);
        const word2 = getWordFromDirectionsArray(parsedData, directions[1]);
        if (
          (word1 == 'SAM' || word1 == 'MAS')
          && (word2 == 'SAM' || word2 == 'MAS')
        ) {
          x_masOccurenceCount++;
        }
      }
    }
  }

  console.log('Level 1 solution: ' + xmasOccurenceCount);
  console.log('Level 2 solution: ' + x_masOccurenceCount);
}

(function () {
  const start = performance.now();
  const dataAsString = readInput();
  const words = parseLinesTo2DArray(dataAsString);

  solve(words);
  const end = performance.now();
  console.log(`Execution time: ${end - start}ms`);
}());


/*

Parse lines into a 2d array

Level 1: 20-26ms
  Look in all 8 directions every time an 'X' is encountered
  Increment the count every time an XMAS is found

Level 2: 40-46ms
  Look in both '/' and '\' directions every time an 'A' is encountered
  If both sides make either a 'SAM' or a 'MAS' increment the count
  
*/
