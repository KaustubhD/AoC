const input = require('./input14').input
const pairMap = new Map()
let start = ''

let silver, gold

// Maintain the pairs in a map.
/*
  Step 1: NNCB translates to { NN: 1, NC: 1, CB: 1}
  Step 2: { NN: 1,             NC: 1,              CB: 1}
        { NC: 1, CN: 1,     NB: 1, BC: 1,       CH: 1, HB: 1}
*/
// Create new pairs from existing pairs and maintain their counts.
// Pro: Max size of map small and defined. No memory issue.
// Con: None so far.

const parseInput = () => {
  const lines = input.split('\n')
  start = lines.splice(0, 1)[0]
  lines.splice(0, 1) // remove empty space
  lines.forEach(x => {
    const pair = x.split(' -> ')
    pairMap.set(pair[0], pair[1])
  })
}

const getInitialChain = () => {
  const pairsRecord = new Map(),
    lettersRecord = new Map()
  lettersRecord.set(start[0], 1)
  
  for(let i = 0; i < start.length - 1; i++) {
    const pair = start.substring(i, i + 2)
    incrementInMap(lettersRecord, pair[1], 1)
    incrementInMap(pairsRecord, pair, 1)
  }
  return { pairsRecord, lettersRecord }
}

const incrementInMap = (map, key, times) => {
  if (!map.has(key))
    map.set(key, times)
  else
    map.set(key, map.get(key) + times)
}

const constructChain = (iterations) => {
  let { pairsRecord, lettersRecord } = getInitialChain()

  for (let i = 1; i <= iterations; i++) {
    const newPairsRecord = new Map()
    for (const [pair, pairCount] of pairsRecord.entries()) {
      const mid = pairMap.get(pair)
      incrementInMap(newPairsRecord, pair[0] + mid, pairCount)
      incrementInMap(newPairsRecord, mid + pair[1], pairCount)
      incrementInMap(lettersRecord, mid, pairCount)
    }
    pairsRecord = newPairsRecord
  }
  return { pairsRecord, lettersRecord }
}

const calculateDifference = (occurenceMap) => {
  let min = Number.MAX_VALUE, max = -1
  for (const value of occurenceMap.values()) {
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return max - min
}

const solve = () => {
  {
    const { lettersRecord } = constructChain(10)
    silver = calculateDifference(lettersRecord)
  }
  {
    const { lettersRecord } = constructChain(40)
    gold = calculateDifference(lettersRecord)
  }
}

parseInput()
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)

/* // Try 2
const input = require('./input14').sampleInput
const pairMap = new Map()
let start = ''

let silver, gold

// Maintain the chain string.
// Create the chain in every iteration.
// Pro: String lighter than objects.
// Con: Takes too much time and memory because of multiple strings. (Actually failed due to pending GC process)

const parseInput = () => {
  const lines = input.split('\n')
  start = lines.splice(0, 1)[0]
  lines.splice(0, 1) // remove empty space
  lines.forEach(x => {
    const pair = x.split(' -> ')
    pairMap.set(pair[0], pair[1])
  })
}

// const displayChain = (startNode) => {
//   let disp = '',
//     currNode = startNode
//   while(currNode) {
//     disp += currNode.value
//     currNode = currNode.next
//   }

//   console.log('Chain is: ' + disp)
// }

const getInitialChain = () => {
  const occurenceMap = new Map()
  // const startNode = new Node(start[0])
  let chain = ''
  // console.log(`Start: ${start}. Start node: ${JSON.stringify(startNode)}`)
  // let currNode = startNode
  // occurenceMap.set(start[0], 1)
  
  for(let polymer of start) {
    occurenceMap.set(polymer, (occurenceMap.get(polymer) || 0) + 1)
    chain += polymer
  }
  
  return {
    occurenceMap, chain
  }
}

const constructChain = (iterations, occurenceMap, chain) => {
  if (!occurenceMap && !chain)
    ({ occurenceMap, chain } = getInitialChain())

  for (let i = 1; i <= iterations; i++) {
    // console.log('Iteration: ' + i + ' ' + chain)
    // let currNode = chain
    let newChain = chain[0]
    // let ind = chain.length - 2
    for (let ind = 0; ind < chain.length - 1; ind++) {
      const first = chain[ind], second = chain[ind + 1]
      const pairPolymer = pairMap.get(first + second)
      if (!pairPolymer)
        throw new Error('No such pair: ' + first.value + second.value)
      
      occurenceMap.set(pairPolymer, (occurenceMap.get(pairPolymer) || 0) + 1)
      newChain += pairPolymer + second
    }
    chain = newChain
  }

  return { occurenceMap, chain }
}

const calculateDifference = (occurenceMap) => {
  let min = Number.MAX_VALUE, max = -1
  for (const value of occurenceMap.values()) {
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return max - min
}

const solve = () => {
  const { occurenceMap, chain } = constructChain(10)
  silver = calculateDifference(occurenceMap)

  const { occurenceMap: newOccurenceMap } = constructChain(30, occurenceMap, chain)
  gold = calculateDifference(newOccurenceMap)
}

parseInput()
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
*/

/* // Try 1
const input = require('./input14').sampleInput
const pairMap = new Map()
let start = ''

let silver, gold

 // Maintain the chain as linked list.
 // Insert nodes in between easily.
 // Pro: One chain. No duplication.
 // Con: Takes too much time.

class Node {
  constructor(val) {
    this.value = val
  }

  addNext(node) {
    node.next = this.next
    this.next = node
  }
}

const parseInput = () => {
  const lines = input.split('\n')
  start = lines.splice(0, 1)[0]
  lines.splice(0, 1) // remove empty space
  lines.forEach(x => {
    const pair = x.split(' -> ')
    pairMap.set(pair[0], pair[1])
  })
}

const displayChain = (startNode) => {
  let disp = '',
    currNode = startNode
  while(currNode) {
    disp += currNode.value
    currNode = currNode.next
  }

  console.log('Chain is: ' + disp)
}

const getInitialChain = () => {
  const occurenceMap = new Map()
  const startNode = new Node(start[0])
  // console.log(`Start: ${start}. Start node: ${JSON.stringify(startNode)}`)
  let currNode = startNode
  occurenceMap.set(start[0], 1)
  
  for(let polymer of start.slice(1)) {
    occurenceMap.set(polymer, (occurenceMap.get(polymer) || 0) + 1)
    currNode.next = new Node(polymer)
    currNode = currNode.next
  }
  
  return {
    occurenceMap, startNode
  }
}

const constructChain = (iterations, occurenceMap, startNode) => {
  if (!occurenceMap && !startNode)
    ({ occurenceMap, startNode } = getInitialChain())

  for (let i = 1; i <= iterations; i++) {
    let currNode = startNode
    while(currNode.next) {
      const first = currNode,
        second = currNode.next
      const pairPolymer = pairMap.get(first.value + second.value)
      if (!pairPolymer)
        throw new Error('No such pair: ' + first.value + second.value)
      
      occurenceMap.set(pairPolymer, (occurenceMap.get(pairPolymer) || 0) + 1)
      first.addNext( new Node(pairPolymer) )
      currNode = second
    }
  }

  return { occurenceMap, startNode }
}

const calculateDifference = (occurenceMap) => {
  let min = Number.MAX_VALUE, max = -1
  for (const value of occurenceMap.values()) {
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return max - min
}

const solve = () => {
  const { occurenceMap, startNode } = constructChain(10)
  silver = calculateDifference(occurenceMap)

  const { occurenceMap: newOccurenceMap } = constructChain(30, occurenceMap, startNode)
  gold = calculateDifference(newOccurenceMap)
}

parseInput()
solve()

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
*/
