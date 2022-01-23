const input = require('./input12').input

let gold, silver
const allNodes = {}

class Node {
  constructor(val) {
    this.value = val
    this.smallCave = this.value === this.value.toLowerCase()
    this.connections = []
  }
  addConnection(val) {
    if (val != 'start' && this.value != 'end')
      !this.connections.includes(val) && this.connections.push(val)
  }
}

const parseInput = (inp) => {
  const createNodeIfNotExists = (val) => {
    if (allNodes[val])
      return allNodes[val]
    else {
      const node = new Node(val)
      allNodes[val] = node
      return node
    }
  }

  inp.split('\n').forEach(line => {
    const [from, to] = line.split('-').map(createNodeIfNotExists)
    from.addConnection(to.value)
    to.addConnection(from.value)
  })
}

const isSmallCaveVisitedOnce = (path) => {
  const set = new Set()
  let smallCaveVisited = false
  path.forEach(val => {
    if (allNodes[val].smallCave && set.has(val))
      smallCaveVisited = val
    set.add(val)
  })

  return smallCaveVisited
}

const isPathTaken = (path, current, next) => {
  return Array.isArray(path) && (path.indexOf(current) == path.indexOf(next) - 1)
}
const createPaths = (part2 = false) => {
  let allPaths = [['start']]
  let completedPaths = 0
  
  Loop1: while(allPaths.length != 0) {
    const path = allPaths.shift()
    const lastNode = allNodes[path[path.length - 1]]

    if (lastNode.value == 'end') {
      completedPaths++
      continue Loop1
    }

    lastNode.connections.forEach(nextConnection => {
      if (part2) {
        if (allNodes[nextConnection].smallCave) {
          const repeated = isSmallCaveVisitedOnce(path)
          if (repeated && (repeated == nextConnection || path.includes(nextConnection)))
            return
        }
      }
      else {
        if (
          (allNodes[nextConnection].smallCave && path.includes(nextConnection)) ||
          (isPathTaken(path, lastNode.value, nextConnection))
        )
          return
      }
      
      allPaths.push([...path, nextConnection])
    })
  }
  return completedPaths
}

const solve = () => {
  const startTime = process.hrtime()
  silver = createPaths()
  gold = createPaths(true)
  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms', endTime[0], endTime[1] / 1000000)
}

parseInput(input)
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
