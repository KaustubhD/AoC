const input = require('./input04').input

let silver, gold
let drawnDigits
let boards = []

const parseInput = inp => {
  let lines = inp.split('\n')

  drawnDigits = lines[0].split(',').map(Number)
  lines.splice(0, 2)

  let board = [], count = 0
  while (lines.length > 0) {
    let boardRow = lines.splice(0, 1)[0]
    
    if (boardRow == '') {
      count = 0
      continue
    }
    boardRow = boardRow
      .split(' ')
      .filter(x => x != '')
      .map(Number)
    
    board.push(boardRow)
    count++
    if(count == 5) {
      boards.push(board)
      board = []
      count = 0
    }
  }
}

const checkCompletion = board => {
  const rowCheck = board.map(row => row.join('')).includes('-1-1-1-1-1')
  if (rowCheck) return rowCheck

  const colCheck = board.reduce((acc, currentRow) => {
    for(let i in currentRow)
      acc[i] += currentRow[i]
    return acc
  }, ['','','','','']).includes('-1-1-1-1-1')
  
  return colCheck
}

const crossIfExists = (board, num) => {
  board.forEach(row => {
    row.forEach((cell, i) => {
      if(cell == num)
        row[i] = -1
    })
  })
}

const calculateScore = (board) => {
  return board.reduce((rowAcc, row) => {
    rowAcc += row.reduce((colAcc, cell) => colAcc + (cell != -1 ? cell : 0), 0)
    return rowAcc
  }, 0)
}

const solve = () => {
  for (const draw of drawnDigits) {
    for (const board of boards) {
      crossIfExists(board, draw)
    }

    for(const [index, board] of boards.entries()) {
      if(checkCompletion(board)) {
        if(!silver){
          silver = calculateScore(board) * draw
        }
        boards.splice(index, 1) // Remove completed boards
        gold = calculateScore(board) * draw
      }
    }
  }
}

parseInput(input)
solve()

console.log('Gold: ' + gold)
console.log('Silver: ' + silver)
