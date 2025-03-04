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

function parseLinesToRulesAndUpdates(dataAsString) {
  const parts = dataAsString.split('\r\n\r\n');
  const rules = parts[0].split('\r\n').reduce((acc, el) => {
    const [f, s] = el.split('|');
    if (acc.has(f)) {
      acc.get(f).push(s);
    } else {
      acc.set(f, [s]);
    }

    return acc;
  }, new Map());
  const updates = parts[1].split('\r\n').map(line => line.split(','));

  return { rules, updates };
}

function solve(rules, updates) {

  let sumOfMiddleNums = 0;
  let sumOfCorrectedMiddleNums = 0;

  let incorrectUpdates = [];
  InstructionLoop: for (const uIndex in updates) {
    const update = updates[uIndex];
    for (let i = 0; i < update.length; i++) {
      if (rules.has(update[i])) {
        const updateRule = rules.get(update[i]);
        for (let numAfter of updateRule) {
          const index = update.indexOf(numAfter);
          if (index > -1 && index < i ) {
            incorrectUpdates.push(uIndex);
            continue InstructionLoop;
          }
        }
      }
    }
    sumOfMiddleNums += parseInt(update[Math.floor(update.length / 2)], 10);
  }

  let incorrectCount = 1111; // Random number to start the loop
  while (incorrectCount > 0) { // Repeat correction process till incorrectCount becomes 0 i.e all are corrected
    incorrectCount = 0;
    sumOfCorrectedMiddleNums = 0; // Reset on every run. On the last run when all will be corrected, this value will be correct too.
    for (let uIndex of incorrectUpdates) {
      const update = updates[uIndex];
  
      for (let i = 0; i < update.length; i++) {
        if (rules.has(update[i])) {
          const updateRule = rules.get(update[i]);
          for (let numAfter of updateRule) {
            const index = update.indexOf(numAfter);
            if (index > -1 && index < i ) {
              incorrectCount++;
              // Swap incorrect updates
              update[index] = update[i];
              update[i] = numAfter;
            }
          }
        }
      }
      sumOfCorrectedMiddleNums += parseInt(update[Math.floor(update.length / 2)], 10);
    }
  }

  console.log('Level 1 solution: ' + sumOfMiddleNums);
  console.log('Level 2 solution: ' + sumOfCorrectedMiddleNums);
}

(function () {
  const start = performance.now();
  const dataAsString = readInput();
  const {rules, updates } = parseLinesToRulesAndUpdates(dataAsString);

  solve(rules, updates);
  const end = performance.now();
  console.log(`Execution time: ${end - start}ms`);
}());


/*

Create a map of {number, [number]} of the instructions/rules denoting a number and all numbers that should come ahead of it
Store each update list in an array

Level 1: 15-18ms
  Iterate over each update's sequence and check it's rule. If any number from the rule is present behind the number under consideration ( const update ), mark the update sequence as incorrect and skip to next
  Calculate the middle number of non-skipped sequences

Level 2: 37-40ms
  Iterate over each incorrect sequence and every time you encounter a number not in accordance with the rule, mark the sequence as incorrect and swap the numbers
  Repeat the process till there are no more incorrect sequences
  Calculate the middle number of non-skipped sequences

*/
