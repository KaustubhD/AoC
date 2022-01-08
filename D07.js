const input = require('./input07').input

let silver, gold

const parseInput = (inp) => inp.split(',').map(Number)

const calculateFuelByCrabEngg = (pos) => {
  return data.reduce((totalFuel, point) => {
    const distance = Math.abs(pos - point)
    totalFuel += ( (distance * (distance + 1)) / 2)
    return totalFuel
  }, 0)
}
const calculateFuelBySimpleEngg = (pos) => {
  return data.reduce((totalFuel, point) => totalFuel += Math.abs(pos - point), 0)
}
const solve = () => {
  let minFuel = 999999

  for(let pos of data) {
    const fuelConsumed = calculateFuelBySimpleEngg(pos)
    minFuel = Math.min(fuelConsumed, minFuel)
  }
  silver = minFuel
  
  const avgPoint = data.reduce((acc, x) => acc += x, 0) / data.length
  gold = Math.min(calculateFuelByCrabEngg(Math.floor(avgPoint)), calculateFuelByCrabEngg(Math.ceil(avgPoint)))
}


const data = parseInput(input)
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
