const input = require('./input11').input
const allZeroes = '0'.repeat(100)

let gold, silver

const parseInput = (inp) => inp.split('\n').map(line => line.split(''))

const checkGold = (data, day) => {
  if (data.map(x => x.join('')).join('') == allZeroes)
    gold = day
}

const increaseNeighbours = (i, j, data) => {
  let hasAbove = i > 0,
    hasLeft = j > 0,
    hasRight = j < data[i].length - 1,
    hasBelow = i < data.length - 1
  
  if (hasAbove)
    data[i - 1][j]++
  if (hasBelow)
    data[i + 1][j]++
  if (hasLeft)
    data[i][j - 1]++
  if (hasRight)
    data[i][j + 1]++
  if (hasAbove && hasLeft)
    data[i - 1][j - 1]++
  if (hasAbove && hasRight)
    data[i - 1][j + 1]++
  if (hasBelow && hasLeft)
    data[i + 1][j - 1]++
  if (hasBelow && hasRight)
    data[i + 1][j + 1]++
}

const flashAndIncrease = (data) => {
  while(true) {
    const currLen = flashed.size
    data.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell > 9 && !flashed.has(`${i}:${j}`)) {
          flashed.add(`${i}:${j}`)
          increaseNeighbours(i, j, data)
        }
      })
    })
    if (flashed.size == currLen)
      break
  }
}

let flashed = new Set()
const lifeGoesOn = (data) => {
  flashed = new Set()
  for (let i = 0; i < data.length; i++)
    for (let j = 0; j < data[0].length; j++)
      data[i][j]++

  flashAndIncrease(data, flashed)

  for (let i = 0; i < data.length; i++)
    for (let j = 0; j < data[0].length; j++)
      if (data[i][j] > 9) {
        data[i][j] = 0
        flashes++
      }
}

const numDays = 100
let flashes = 0
const solve = (data) => {
  for(let day = 1; day <= numDays; day++){
    lifeGoesOn(data)
    checkGold(data, day)
  }
  silver = flashes

  let day = numDays
  while (!gold) {
    lifeGoesOn(data)
    day++
    checkGold(data, day)
  }
}

solve(parseInput(input))

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
