const input = require('./input1.js').input

let gold = 0
let silver = 0

const parseInput = inp => {
  return inp.split('\n').map(Number)
}

const solve = (arr) => {
  for(let i = 1; i < arr.length; i++) {
    if(arr[i] > arr[i - 1]) {
      gold++
    }
  }

  for(let i = 3; i < arr.length; i++) {
    let cur = (arr[i] + arr[i - 1] + arr[i - 2])
    let prev = (arr[i - 1] + arr[i - 2] + arr[i - 3])

    if (cur > prev) {
      silver++
    }
  }
}
solve(parseInput(input))

console.log('Gold: ' + gold)
console.log('Silver: ' + silver)
