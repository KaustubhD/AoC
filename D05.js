const input = require('./input05').input

let silver, gold

class Record {
  constructor() {
    this.record = {}
  }

  addPoints(coords) {
    coords.forEach(coord => {
      const key = coord.join(',')
      this.record[key] = this.record[key] ? this.record[key] + 1 : 1
    })
  }

  get numIntersectedPoints() {
    return Object.values(this.record).filter(val => val > 1).length
  }
}

const parseInput = (inp) => { 
  return inp
    .split('\n')
    .map(line => line
      .split(' -> ')
      .map(divided => divided
        .split(',')
        .map(Number)
      )
    )
}

const getAllPointsInLine = ([from, to]) => {
  const points = []

  let start = Array.from(from)
  points.push(Array.from(start))

  while(!(start[0] == to[0] && start[1] == to[1])) {
    start[0] += Math.sign(to[0] - start[0])
    start[1] += Math.sign(to[1] - start[1])
    points.push(Array.from(start))
  }
  
  return points
}

const solve = (data) => {
  const record = new Record()
  data.forEach(line => {
    record.addPoints(getAllPointsInLine(line))
  })
  return record.numIntersectedPoints
}

const coordinates = parseInput(input)

silver = solve(
  coordinates.filter(([from, to]) => (
    from[0] == to[0] ||
    from[1] == to[1]
  ))
)

gold = solve(
  coordinates.filter(([from, to]) => (
    from[0] == to[0] ||
    from[1] == to[1] ||
    (Math.abs(from[1] - to[1]) / Math.abs(from[0] - to[0])) == 1
  ))
)

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
