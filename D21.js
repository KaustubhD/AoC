const input = require('./input21').input
const NUM_SPACES = 10

let silver, gold

const parseInput = () => {
  return input.split('\n').map(x => Number(x.split(': ').pop()))
}

class FirstGame {
  constructor(p1, p2, dieCap, threshold) {
    this.DIE_CAP = dieCap
    this.THRESHOLD_SCORE = threshold
    this.initialise(p1, p2)
  }

  initialise(pos1, pos2) {
    this.p1 = { pos: pos1, score: 0 }
    this.p2 = { pos: pos2, score: 0 }
    this.die = 0
    this.dieRolledTimes = 0
    this.turn = 0  
  }

  rollDie() {
    this.die = this.die % this.DIE_CAP + 1
    this.dieRolledTimes++
    return this.die
  }

  hasWon(player) {
    return player.score >= this.THRESHOLD_SCORE
  }

  start() {
    while (!this.hasWon(this.p1) && !this.hasWon(this.p2)) {
      const sum = this.rollDie() + this.rollDie() + this.rollDie()
      this.playTurn(sum)
    }
  }

  playTurn(sum) {
    const player = this.turn % 2 == 0 ? this.p1 : this.p2
    player.pos = (player.pos + sum) % NUM_SPACES || 10
    player.score += player.pos
    this.turn++
  }

  getLosingScore() {
    return (this.hasWon(this.p1) ? this.p2.score : this.p1.score) * this.dieRolledTimes
  }
}

class SecondGame {
  constructor(p1, p2, threshold) {
    this.THRESHOLD_SCORE = threshold
    this.p1StartAt = p1
    this.p2StartAt = p2
    this.memo = {}
    this.generateSumCombinations()
  }

  generateSumCombinations() {
    this.sumCombos = new Map([[3,1],[4,3],[5,6],[6,7],[7,6],[8,3],[9,1]])
  }

  start() {
    this.universesWon = this.playTurn(this.p1StartAt, this.p2StartAt, 0, 0)
  }

  playTurn(p1, p2, p1Score, p2Score) {
    const memoId = `${p1}-${p2}-${p1Score}-${p2Score}`
  
    if (this.memo[memoId])
      return this.memo[memoId]
    if (this.hasWon(p2Score))
      return [0, 1]
    if (this.hasWon(p1Score))
      return [1, 0]
  
    const wins = [0, 0]
    for (const [chosenSum, freq] of this.sumCombos.entries()) {
      let tempPos = p1, tempScore = p1Score
      tempPos = (tempPos + chosenSum) % NUM_SPACES || NUM_SPACES
      tempScore += tempPos

      const universesWon = this.playTurn(p2, tempPos, p2Score, tempScore)
        .map(x => x * freq)
      
      wins[0] += universesWon[1]
      wins[1] += universesWon[0]
    }
    this.memo[memoId] = wins
  
    return wins
  }

  hasWon(score) {
    return score >= this.THRESHOLD_SCORE
  }

  getMaxUniversesWon() {
    return Math.max(...this.universesWon)
  }
}

const solve = ([positionOne, positionTwo]) => {
  const startTime = process.hrtime()
  {
    const game = new FirstGame(positionOne, positionTwo, 10, 1000)
    game.start()
    silver = game.getLosingScore()
  }
  {
    const game = new SecondGame(positionOne, positionTwo, 21)
    game.start()
    gold = game.getMaxUniversesWon()
  }
  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms\n========', endTime[0], endTime[1] / 1000000)
}

solve(parseInput())

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
