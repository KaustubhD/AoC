const input = require('./input10').input

let gold, silver

const scoreMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}
const restoreScoreMap = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
}
const opposite = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
}

const parseInput = (inp) => inp.split('\n').map(x => x.split(''))

const solve = (data) => {
  const corrupted = []
  const incompleteScores = []
  let corruptedScore = 0
  Loop1: for(const line of data) {
    const stack = []
    for (const sym of line) {
      if (['(', '[', '<', '{'].includes(sym)) {
        stack.push(sym)
      }
      else {
        const pop = stack.pop()
        if (pop !== opposite[sym]) {
          corruptedScore += scoreMap[sym]
          corrupted.push(line)
          continue Loop1
        }
      }
    }
    if (stack.length) {
      let incompleteScore = 0
      while (stack.length > 0) {
        const closingBracket = opposite[stack.pop()]
        incompleteScore *= 5
        incompleteScore += restoreScoreMap[closingBracket]
      }
      incompleteScores.push(incompleteScore)
    }
  }
  silver = corruptedScore
  gold = incompleteScores.sort((a, b) => a - b)[Math.floor(incompleteScores.length / 2)]
}

solve(parseInput(input))

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
