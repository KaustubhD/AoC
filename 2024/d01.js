const fs = require('fs');

const inputFilePath = './input.txt';

function readInput() {
  if (!fs.existsSync(inputFilePath)) {
    throw new Error('Please provide an input.txt');
  }
  const data = fs.readFileSync(inputFilePath).toString();
  return data;
}

function parseTwoColumnsAsNumbers(dataAsString) {
  const column1 = [], column2 = [];
  dataAsString.split(/\r*\n/).forEach(line => {
    const columns = line.split('   ');
    column1.push(columns[0]);
    column2.push(columns[1]);
  });

  return [column1, column2];
}

function solve(parsedData) {
  const sortedColumn1 = parsedData[0].sort((a, b) => a - b);
  const sortedColumn2 = parsedData[1].sort((a, b) => a - b);
  const column2OccurenceMap = new Map();

  let totalDistance = 0;
  let similarityScore = 0;

  for(let i = 0; i < sortedColumn1.length; i++) {
    totalDistance += Math.abs(sortedColumn1[i] - sortedColumn2[i]);

    const occurenceCount = column2OccurenceMap.get(sortedColumn2[i]);
    if (occurenceCount == undefined) {
      column2OccurenceMap.set(sortedColumn2[i], 1);
    } else {
      column2OccurenceMap.set(sortedColumn2[i], occurenceCount + 1);
    }
  }

  for(let i = 0; i < sortedColumn1.length; i++) {
    const occurenceCount = column2OccurenceMap.get(sortedColumn1[i]) || 0;
    similarityScore += sortedColumn1[i] * occurenceCount;
  }

  console.log('Level 1 solution: ' + totalDistance);
  console.log('Level 2 solution: ' + similarityScore);
}

(function () {
  const dataAsString = readInput();
  const arrays = parseTwoColumnsAsNumbers(dataAsString);
  
  solve(arrays);
}());


/*

Parse column 1 and 2 into two separate arrays (O(n))
Sort them individually (O(2 * n^2))

Level 1:
  Complexity: O(n)
Iterate and calculate the distance between both elements at the 'i'th position

Level 2:
  Complexity: O(2n)
Create an occurence count map from column 2
Iterate over column 1 and multiply with it's occurence count

*/
