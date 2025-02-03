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

function parseLinesToNumbersArray(dataAsString) {
  const reports = dataAsString.split(/\r*\n/).map(line => {
    return line.split(' ').map( i => parseInt(i, 10));
  });

  return reports;
}

function slope(numOne, numTwo) {
  if (numOne == numTwo) {
    return 0;
  } else if (numOne < numTwo) {
    return 1;
  } else {
    return -1;
  }
}

function analyseReport(report) {
  let ogSlope = slope(report[0], report[1]);

  for (let i = 0; i < report.length - 1; i++) {
    const diff = Math.abs(report[i] - report[i + 1]);
    const newSlope = slope(report[i], report[i + 1]);
    if (
      (report[i] == report[i + 1])
      || (ogSlope != newSlope)
      || (diff < 1)
      || (diff > 3)
    ) {
      return i + 1;
    }
  }
  return -1;
}

function solve(parsedData) {
  let safeReportCount = 0;
  let safeDampenedReportCount = 0;

  parsedData.forEach(report => {
    const incorrectIndex = analyseReport(report);
    if (incorrectIndex == -1) {
      safeReportCount++;
    } else {
      let clonedReport1 = [...report];
      let clonedReport2 = [...report];
      let clonedReport3 = [...report];
      clonedReport1.splice(incorrectIndex, 1);
      clonedReport2.splice(incorrectIndex - 1, 1);
      clonedReport3.splice(incorrectIndex - 2, 1);
      if (analyseReport(clonedReport1) == -1 || analyseReport(clonedReport2) == -1 || analyseReport(clonedReport3) == -1) {
        safeDampenedReportCount++;
      }
    }
  });

  console.log('Level 1 solution: ' + safeReportCount);
  console.log('Level 2 solution: ' + (safeReportCount + safeDampenedReportCount));
}

(function () {
  const start = performance.now();
  const dataAsString = readInput();
  const reports = parseLinesToNumbersArray(dataAsString);
  
  solve(reports);
  const end = performance.now();
  console.log(`Execution time: ${end - start}ms`);
}());


/*

Level 1: 13.243499999999997ms
  Compare the adjacent elements in a row.
  Return the first index at fault

Level 2: 16 - 27ms
  Retry the validation process after removing the ith, i - 1th and i - 2th element
  If it passes, add it to the count
  
*/
