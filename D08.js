const input = require('./input08').input

let gold, silver

const parseInput = (inp) => {
  const sortString = (str) => str.split('').sort().join('')
  
  return inp
    .split('\n')
    .map(line => line
      .split(' | ')
    )
    .map(([signals, output]) => {
      return {
        in: signals.split(' ').map(sortString),
        out: output.split(' ').map(sortString)
      }
    })
}

const getDigitMap = (inp) => {
  const map = {}
  const addToMap = (combination, value) => {
    if (map[value + '']){
      console.log(map)
      throw new Error(`Found two ${value}: ${map[value + '']} and ${combination}`)
    }
    map[combination] = value
    map[value] = combination
  }

  for(const combo of inp) {
    switch(combo.length) {
      case 2:
        addToMap(combo, 1)
        break
      case 3:
        addToMap(combo, 7)
        break
      case 4:
        addToMap(combo, 4)
        break
      case 7:
        addToMap(combo, 8)
        break
    }
  }

  const fivers = inp.filter(combo => combo.length == 5)
  fivers.forEach(combo => {
    if( map['1'].split('').every(signal => combo.includes(signal)) )
      addToMap(combo, 3)
    else if( map['4'].split('').filter(signal => !combo.includes(signal)).length === 1 )
      addToMap(combo, 5)
    else
      addToMap(combo, 2)
  })

  const sixers = inp.filter(combo => combo.length == 6)
  sixers.forEach(combo => {
    if( map['1'].split('').some(signal => !combo.includes(signal)) )
      addToMap(combo, 6)
    else if( map['4'].split('').every(signal => combo.includes(signal)) )
      addToMap(combo, 9)
    else
      addToMap(combo, 0)
  })
  return map
}

const solve = (data) => {
  const uniqueLengths = [2,3,4,7]
  let counter = 0
  for (const { out } of data) {
    counter += out.filter(digit => uniqueLengths.includes(digit.length)).length
  }
  silver = counter

  let sum = 0
  for (const line of data) {
    const map = getDigitMap(line['in'])
    let strNum = line['out'].reduce((acc, x) => acc += map[x], '')
    sum += parseInt(strNum)
  }
  gold = sum
}

solve(parseInput(input))

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
