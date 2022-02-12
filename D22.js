const input = require('./input22').anotherInput

let silver, gold

/*
 * For part 2
 * Case : instruction is On
 *    Perform set addition
 *    A + B = (A ∪ B) - (A ∩ B)
 * 
 * Case : instruction is Off
 *    Perform set difference
 *    A - B = A - (A ∩ B)
 * 
 * Intersection is removed in both cases
 * 
 * Algo:
 *    For every step, check if that step intersects with any previous cuboid
 *      If so, remove that intersection
 *      If the step was to turn on, add the step to cuboids list
 *    Calculate volumes. Add the added cuboid's volumes and subtract intersection's volumes
*/

class Cuboid {
  constructor(sign, dimX, dimY, dimZ) {
    this.x = dimX
    this.y = dimY
    this.z = dimZ
    this.sign = sign
    this.volume = this.sign *
      (this.x[1] - this.x[0] + 1) *
      (this.y[1] - this.y[0] + 1) *
      (this.z[1] - this.z[0] + 1)
  }
}

const parseInput = () => {
  const lines = input.split('\n')
  return lines.map(line => {
    const obj = {}
    const [ instruction, dims ] = line.split(' ')
    obj.dimensions = dims.split(',').map(dimToken => dimToken.slice(2).split('..').map(Number))
    obj.instruction = instruction

    return obj
  })
}

const parseToCuboids = (steps) => {
  return steps.map(({instruction, dimensions}) => new Cuboid(instruction == 'on' ? 1 : -1, ...dimensions))
}

const getNormalisedDimensions = (dimensions, LIMIT) => {
  const newDimensions = [0, 0]
  newDimensions[0] = LIMIT[0] <= dimensions[0] ? Math.abs(dimensions[0] - LIMIT[0]) : 0
  newDimensions[1] = dimensions[1] > LIMIT[0] ? Math.min(newDimensions[0] + dimensions[1] - dimensions[0], (LIMIT[1] * 2)) : -1
  return newDimensions
}

const initializationProcedure = (inputs, LIMIT) => {
  let normX, normY, normZ
  let set = new Set()

  for (const {instruction, dimensions} of inputs) {
    normX = getNormalisedDimensions(dimensions[0], LIMIT)
    normY = getNormalisedDimensions(dimensions[1], LIMIT)
    normZ = getNormalisedDimensions(dimensions[2], LIMIT)
    for (let i = normX[0]; i <= normX[1]; i++) {
      for (let j = normY[0]; j <= normY[1]; j++) {
        for (let k = normZ[0]; k <= normZ[1]; k++) {
          if (instruction == 'on')
            set.add(`${i}-${j}-${k}`)
          else
            set.delete(`${i}-${j}-${k}`)
        }
      }
    }
  }

  return set.size
}

const intersect = (c1, c2) => {
  const intersection = new Cuboid(
    -c2.sign,
    [
      Math.max(c1.x[0], c2.x[0]),
      Math.min(c1.x[1], c2.x[1]),
    ],
    [
      Math.max(c1.y[0], c2.y[0]),
      Math.min(c1.y[1], c2.y[1]),
    ],
    [
      Math.max(c1.z[0], c2.z[0]),
      Math.min(c1.z[1], c2.z[1]),
    ])
  return (
    intersection.x[0] > intersection.x[1] || 
    intersection.y[0] > intersection.y[1] || 
    intersection.z[0] > intersection.z[1]
  ) ? undefined : intersection
}

const reboot = (steps) => {
  steps = parseToCuboids(steps)
  const cuboids = []

  for (const step of steps) {
    const intersections = cuboids
      .map(cuboid => {
        return intersect(step, cuboid)
      })
      .filter(x => x != undefined)
    
    if (intersections.length)
      cuboids.push(...intersections)
    if (step.sign == 1) // Add actual cuboid if the instruction was on
      cuboids.push(step)
  }

  return cuboids.reduce((acc, cuboid) => acc + cuboid.volume, 0)
}

const solve = (inp) => {
  const startTime = process.hrtime()
  {
    const LIMIT = [-50, 50]
    silver = initializationProcedure(inp, LIMIT)
  }
  { 
    gold = reboot(inp)
  }
  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms\n========', endTime[0], endTime[1] / 1000000)
}

solve(parseInput())

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
