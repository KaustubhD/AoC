const input = require('./input13').input

let gold, silver

const parseInput = () => {
  const lines = input.split('\n')
  const separatingLine = lines.indexOf('')

  const dots = []
  let maxX = 0, maxY = 0

  for(let i = 0; i < separatingLine; i++) {
    const [x, y] = lines[i].split(',').map(Number)
    maxX = Math.max(x, maxX)
    maxY = Math.max(y, maxY)
    dots.push([x, y])
  }
  let board = new Array(maxY + 1).fill(null).map(x => new Array(maxX + 1).fill('.'))

  dots.forEach(([x, y]) => { board[y][x] = '#' })

  const foldInstructions = []
  for (let i = separatingLine + 1; i < lines.length; i++) {
    const val = parseInt(lines[i].slice(13))
    if (lines[i].startsWith('fold along x='))
      foldInstructions.push([val, undefined])
    else
      foldInstructions.push([undefined, val])
  }

  return {
    board,
    foldInstructions
  }
}

const foldUp = (board, creaseAt) => {
  for (let i = creaseAt + 1; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] == '#') {
        const newX = creaseAt - ( i - creaseAt )
        if (newX < 0) {
          throw new Error(`Negative x. Old pos: ${i},${j}. Fold at ${creaseAt}`)
        }
        board[newX][j] = '#'
      }
    }
  }
  board.splice(creaseAt)
}

const foldLeft = (board, creaseAt) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = creaseAt + 1; j < board[0].length; j++) {
      if (board[i][j] == '#') {
        const newY = creaseAt - ( j - creaseAt )
        if (newY < 0) {
          throw new Error(`Negative y. Old pos: ${i},${j}. Fold at ${creaseAt}`)
        }
        board[i][newY] = '#'
      }
    }
  }
  board.forEach(row => row.splice(creaseAt))
}

const calculateDots = (board) => {
  return board.reduce((numDots, row) => {
    numDots += row.filter(cell => cell == '#').length
    return numDots
  }, 0)
}

const solve = ({board, foldInstructions}) => {
  const [x, y] = foldInstructions[0]
    if (x)
      foldLeft(board, x)
    else
      foldUp(board, y)

  silver = calculateDots(board)
    
  for(const [x,y] of foldInstructions.slice(1)) {
    if (x)
      foldLeft(board, x)
    else
      foldUp(board, y)
  }
  
  gold = board.map(x => x.join('')).join('\n')
}

solve(parseInput(input))

console.log('Silver: ' + silver)
console.log('Gold:\n' + gold)
