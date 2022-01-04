const input = require('./input02').input

let gold
let silver

const parseInput = inp => inp.split('\n')

const prepInput = (arr) => {
  return arr.map(x => {
    const [dir, num] = x.split(' ')
    return [dir, parseInt(num)]
  })
}

const solve = (arr) => {
  let x = 0, y = 0, aimDepth = 0
  const path = prepInput(arr)

  path.forEach(([dir, val]) => {
    switch(dir) {
      case 'forward':
        x += val
        aimDepth += (y * val)
        break
      case 'up':
        y -= val
        break
      case 'down':
        y += val
        break
    }
  })
  gold = x * y
  silver = x * aimDepth
}

solve(parseInput(input))

console.log('Gold: ' + gold)
console.log('Silver: ' + silver)
