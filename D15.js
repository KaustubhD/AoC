const input = require('./input15.js').input

/*
  Approach 1: Update each cell with the minimum of its top and left risk (top down)
  Approach 2: Recursively get the min of bottom and right cell (bottom up)
  Approach 3: Use A*
*/
let gold, silver, numRows, numCols

class Cell {
  constructor(i, j, risk) {
    this.i = i
    this.j = j
    this.f = 0
    this.g = Number.MAX_VALUE
    this.risk = risk
    this.neighbours = []
  }
}

const increaseGridVertical = (grid, count) => {
  const startAt = numRows + (numRows * count)
  for (let i = startAt; i < startAt + numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = (grid[i - numRows][j] % 9) + 1
    }
  }
}

const increaseGridHorizontal = (grid, vCount) => {
  for (let i = 0; i < numRows * 5; i++) {
    for (let j = numCols; j < numCols * 5; j++) {
      grid[i][j] = (grid[i][j - numCols] % 9) + 1
    }
  }
}

const parseInput = (inp, expandFiveFold = false) => {
  console.log('Started parsing input')  
  
  const grid = inp.split('\n').map(line => line.split('').map(Number))
  numRows = grid.length
  numCols = grid[0].length
  
  if (expandFiveFold) {
    grid.forEach(row => row.push(new Array(numCols * 4).fill(0)))
    grid.push(...new Array(numRows * 4).fill(0).map(_ => new Array(numCols * 5).fill(0))) // create new array and rest is same

    for (let count = 0; count < 4; count++) { // create left wall
      increaseGridVertical(grid, count)
    }
    for (let count = 0; count < 5; count++) { // spread right
      increaseGridHorizontal(grid, count)
    }
    numRows *= 5
    numCols *= 5
  }
  createCellsAndsNeighbours(grid)

  console.log('Finished parsing input')
  return grid
}

const createCellsAndsNeighbours = (grid) => {
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      grid[i][j] = new Cell(i, j, cell)
      if (i > 0) {
        grid[i - 1][j].neighbours.push(grid[i][j])
        grid[i][j].neighbours.push(grid[i - 1][j])
      }
      if (j > 0) {
        grid[i][j - 1].neighbours.push(grid[i][j])
        grid[i][j].neighbours.push(grid[i][j - 1])
      }
    })
  })
}

const getMinFFromOpenSet = (set) => {
  let minVal = 999999999999999,
    target
  for (const val of set.values()) {
    if (val.f < minVal) {
      target = val
      minVal = val.f
    }
  }
  return target
}

const heuristic = (start, end) => {
  return Math.abs(start.i - end.i) + Math.abs(start.j - end.j) // Manhattan distance
}

const aStar = (grid) => {
  const start = grid[0][0], end = grid[numRows - 1][numCols - 1]
  const openSet = new Set([ start ])

  start.f = heuristic(start, end)
  start.g = 0

  while (openSet.size > 0) {
    const minF = getMinFFromOpenSet(openSet)
    if (minF == end) {
      console.log('Done')
      break
    }
    openSet.delete(minF)
    for (const neigh of minF.neighbours) {
      let tempG = minF.g + neigh.risk
      if (tempG < neigh.g) {
        neigh.g = tempG
        neigh.f = tempG + heuristic(neigh, end)
        openSet.add(neigh)
      }
    }
  }
  return end.f
}

const solve = () => {
  console.log('Started solving')
  const startTime = process.hrtime()
  {
    const grid = parseInput(input)
    silver = aStar(grid)
  }
  {
    const grid = parseInput(input, true)
    gold = aStar(grid)
  }
  
  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms\n========', endTime[0], endTime[1] / 1000000)
}

solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)

/*
const input = require('./input15.js').input
const memo = {}

let baseArray, numRows, numCols
let gold, silver

const parseInput = () => {
  baseArray = input.split('\n').map(line => line.split('').map(Number))
  numRows = baseArray.length
  numCols = baseArray[0].length
}

const createShortestMap = (i, j) => {
  console.log(i + ', ' + j)
  if (memo[`${i},${j}`])
    return memo[`${i},${j}`]
  if (i > numRows - 1 || j > numCols - 1)
    return 999999999999999999999999
  if (i ==  numRows - 1 && j == numCols - 1)
    return baseArray[i][j]

  const min = baseArray[i][j] + Math.min(
    createShortestMap(i + 1, j),
    createShortestMap(i, j + 1)
  )
  memo[`${i},${j}`] = min
  return min
}

// const createShortestMap = (baseArr) => {
//   // console.log(baseArr[0])
//   const numRows = baseArr.length, numCols = baseArr[0].length
//   baseArr[0][0] = 0
//   const previousCells = (x, y) => {
//     const cells = []
//     if (y < numCols - 1)
//       cells.push( baseArr[x][y] + baseArr[x][y + 1] ) // left
//     if (x < numRows - 1)
//       cells.push( baseArr[x][y] + baseArr[x + 1][y] ) // top
//     return cells
//   }

//   for (let i = numRows - 1; i >= 0; i--) {
//     for (let j = numCols - 1; j >= 0; j--) {
//       if (i == 0 && j == 0)
//         continue
//       const neighbours = previousCells(i, j)
//       if (i == baseArr.length - 1 && j == baseArr[0].length - 1) {
//         console.log(`i = ${i}, j = ${j}, value = ${baseArr[i][j]}. Neighbours = [${neighbours.join(',')}]`)
//       }

//       baseArr[i][j] = Math.min(...previousCells(i, j))
//     }
//   }

//   return baseArr
// }

const solve = () => {
  baseArray[0][0] = 0
  const shortest = createShortestMap(0, 0)
  // console.log(
  //   short.map((row, rowInd) => 
  //     row.map((cell, cellInd) => 
  //       moved.includes(rowInd+','+cellInd) ? `(${cell})` : cell
  //     )
  //   ).join('\n'))
  // console.log(short.join('\n'))

  silver = shortest
}

parseInput()
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)

*/
