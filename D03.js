const input = require('./input03').input

let gold, silver

const parseInput = inp => inp.split('\n')

const solve = () => {
  let gamma = '', epsilon = ''
  let map = (new Array(data[0].length)).fill(null).map(() => new Array(2).fill(0))
  
  data.forEach(binary => {
    for(let i in binary) {
      digit = parseInt(binary[i])
      map[i][digit]++
    }
  })
  map.forEach(([num0, num1]) => {
    if(num0 > num1) {
      gamma += '0'
      epsilon += '1'
    }
    else{
      gamma += '1'
      epsilon += '0'
    }
  })
  gold = parseInt(gamma, 2) * parseInt(epsilon, 2)
}

const filterData = ((indices, pos, gas) => {
  if(indices.length == 1) {
    return data[indices[0]]
  }
  const zeroIndices = [], oneIndices = []
  for(let index of indices) {
    if(data[index][pos] == '0')
      zeroIndices.push(index)
    else
      oneIndices.push(index)
  }

  if(gas == 'o2') {
    if(zeroIndices.length > oneIndices.length)
      indices = zeroIndices
    else if(zeroIndices.length <= oneIndices.length)
      indices = oneIndices
  }
  else if(gas == 'co2') {
    if(zeroIndices.length > oneIndices.length)
      indices = oneIndices
    else if(zeroIndices.length <= oneIndices.length)
      indices = zeroIndices
  }
  return filterData(indices, pos + 1, gas)
})

const solvePartTwo = () => {
  let o2Indices = [...data.keys()], co2Indices = [...data.keys()]
  
  const o2Rating = filterData(o2Indices, 0, 'o2')
  const co2Rating = filterData(co2Indices, 0, 'co2')
  
  silver = parseInt(o2Rating, 2) * parseInt(co2Rating, 2)
}

const data = parseInput(input)
solve()
solvePartTwo()

console.log('Gold: ' + gold)
console.log('Silver: ' + silver)
