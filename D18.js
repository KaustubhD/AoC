const input = require('./input18.js').input

let silver, gold

const parseInput = (inp) => inp.split('\n').map(parseStringToSnailNum)

const parseStringToSnailNum = (line) => line.split('').map(char => isNaN(char) ? char : parseInt(char))

// const calculateMagnitude = (snailNum) => {
// /* Modifies original array */
//   if (snailNum.length <= 1) {
//     console.log('Finally : ' + snailNum)
//     return snailNum[0]
//   }

//   for (let i = 0; i < snailNum.length - 3; i++) {
//     if (!isNaN(snailNum[i]) && !isNaN(snailNum[i + 2])) {
//       const mag = (3 * snailNum[i]) + (2 * snailNum[i + 2])
//       snailNum.splice(i - 1, 5, mag)
//       break
//     }
//   }
//   return calculateMagnitude(snailNum)
// }

const calculateMagnitude = (snailNum) => {
  return eval(snailNum.join('').replaceAll("[", "(3*").replaceAll(",", " + 2*").replaceAll("]", ")"))
}

const getExplodeIndex = (num) => {
  const stack = []
  let i = 0
  while (true) {
    if (i > num.length - 1)
      return -1
    if (num[i] == '[') {
      stack.push(i)
      if (stack.length >= 5 && !isNaN(num[i + 1]) && !isNaN(num[i + 3]) ) // Found a regular pair more than 3 levels deep
        break
    }
    else if (num[i] == ']')
      stack.pop()
    i++
  }
  return stack.pop()
}

const split = (num, index) => {
  // console.log('Splitting: ' + num[index])
  const newPair = ['[', Math.floor(num[index] / 2), ',', Math.ceil(num[index] / 2), ']']

  num.splice(index, 1, ...newPair)
  // console.log('After :\t\t' + num.join(''))
}

const explode = (num, index) => {
  const explodingPair = [num[index + 1], num[index + 3]]
  // console.log(`Exploding [${explodingPair.join(',')}]`)

  for (let i = index; i >= 0; i--) { // Add pair's left to immediate left digit
    if (!isNaN(num[i])) {
      num[i] += explodingPair[0]
      break
    }
  }
  
  for (let i = index + 4; i <= num.length; i++) { // Add pair's right to immediate right digit
    if (!isNaN(num[i])) {
      num[i] += explodingPair[1]
      break
    }
  }
  num.splice(index, 5, 0) // Replace exploding pair with 0
}

const tryExplode = (num) => {
  const explodeIndex = getExplodeIndex(num)
    
  if (explodeIndex != -1) {
    explode(num, explodeIndex)
    // console.log('After :\t\t' + num.join(''))
    return true
  }
  return false
}

const trySplit = (num) => {
  const splitIndex = num.findIndex(x => !isNaN(x) && x > 9)
  if (splitIndex != -1) {
    split(num, splitIndex)
    return true
  }
  return false
}

const reduceSnailNumber = (num) => {
  // console.log('Reducing: ' + num.join(''))
  while(true) {
    if (tryExplode(num))
      continue
    if (trySplit(num))
      continue

    break
  }
}

const addSnailNumbers = (acc, num2) => {
  acc.unshift('[')
  acc.push(',', ...num2, ']')

  reduceSnailNumber(acc)
}

const solve = () => {
  const startTime = process.hrtime()
  {
    console.log('Solving for silver')
    const snailNums = parseInput(input)
    for (let i = 1; i < snailNums.length; i++) {
      addSnailNumbers(snailNums[0], snailNums[i])
    }
    silver = calculateMagnitude(snailNums[0])
    console.log('Silver complete')
  }
  {
    console.log('Solving for gold')
    let maxMag = 0
    const snailNums = parseInput(input)
    for (let i = 0; i < snailNums.length; i++) {
      for (let j = 0; j < snailNums.length; j++) {
        const cloneLeft = Array.from(snailNums[i]),
          cloneRight = Array.from(snailNums[j])
        addSnailNumbers(cloneLeft, snailNums[j])
        addSnailNumbers(cloneRight, snailNums[i])

        maxMag = Math.max(maxMag,
                          calculateMagnitude(cloneLeft),
                          calculateMagnitude(cloneRight))
      }
    }
    gold = maxMag
    console.log('Gold complete')
  }
  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms\n========', endTime[0], endTime[1] / 1000000)
}

solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
