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

function parseLinesToInstructionString(dataAsString) {
  return dataAsString.split(/\r*\n/).join('');
}

function executeMulInstructions(instruction) {
  const multiplyInstructionRegex = new RegExp('mul\\((\\d+),(\\d+)\\)', 'g');
  let sum = BigInt(0);

  const matches = [...(instruction.matchAll(multiplyInstructionRegex))];
  for (let match of matches) {
    sum += BigInt(parseInt(match[1], 10) * parseInt(match[2], 10));
  }

  return sum;
}

function executeAllowedMulInstructions(instruction) {
  const dosAndDontsRegex = new RegExp('(?<g1>don\'t\\(\\))|(?<g2>do\\(\\))', 'g');
  
  let parsed = '' + instruction;
  let dontStartIndex = undefined;
  const matches = [...(parsed.matchAll(dosAndDontsRegex))];

  for (const match of matches) {
    if (match.groups.g1) {
      if (dontStartIndex == undefined) {
        dontStartIndex = match.index;
      }
    } else if (match.groups.g2) {
      if (dontStartIndex != undefined) {
        parsed = parsed.substring(0, dontStartIndex) + '_'.repeat(match.index - dontStartIndex) + parsed.substring(match.index);
        dontStartIndex = undefined;
      }
    }
  }
  if (dontStartIndex != undefined) {
    parsed = parsed.substring(0, dontStartIndex);
    dontStartIndex = undefined;
  }

  return executeMulInstructions(parsed);
}

function solve(instruction) {
  const sum = executeMulInstructions(instruction);
  const sumLevel2 = executeAllowedMulInstructions(instruction);

  console.log('Level 1 solution: ' + sum);
  console.log('Level 2 solution: ' + sumLevel2);
}

(function () {
  const start = performance.now();
  const dataAsString = readInput();
  const instructions = parseLinesToInstructionString(dataAsString);
  
  solve(instructions);
  const end = performance.now();
  console.log(`Execution time: ${end - start}ms`);
}());


/*

Combine all lines into a single line

Level 1: 10-23ms
  Create a grouped regex to get each pair of numbers
  Multiply and add said numbers

Level 2: 10-17ms
  Create a regex to get the dos and donts
  Replace the string present between a do and a don't with blanks ('___')
  If the last occurence is a don't, remove the string after it till the end
  Evaluate the string left using the Level 1 fn
  
*/
