const input = require('./input20').input

let silver, gold

const parseInput = () => {
  let [algo, image] = input.split('\n\n')
  image = image.split('\n').map(x => x.split(''))

  return {algo, image}
}

const padImage = (image, n, filler) => {
  const rowPadding = filler.repeat(image[0].length + (2 * n))
  const colPadding = filler.repeat(n)
  
  for (const row of image) {
    row.unshift(...colPadding.split(''))
    row.push(...colPadding.split(''))
  }

  for (let i = 0; i < n; i++) {
    image.unshift(rowPadding.split(''))
    image.push(rowPadding.split(''))
  }
}

const getBinaryFromNeighbours = (image, i, j, filler) => {
  let bin = ''

  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      bin += (image[x]?.[y] || filler) == '#' ? 1 : 0
    }
  }
  return bin
}

const enhance = (image, algo, filler) => {
  padImage(image, 1, filler)
  const output = JSON.parse(JSON.stringify(image))
  let lightPixels = 0

  image.forEach((row, i) => {
    row.forEach((_, j) => {
      const algoIndex = parseInt(getBinaryFromNeighbours(image, i, j, filler), 2)
      output[i][j] = algo[algoIndex]
      algo[algoIndex] == '#' && lightPixels++
    })
  })
  return { output, lightPixels }
}

const enchanceNTimesAndGetLightPixels = (image, algo, n) => {
  let lightPixels = 0
  for (i = 0; i < n; i++) {
    const filler = algo[0] == '#' && algo[algo.length - 1] == '.' && (i % 2) == 0 ? '.' : '#'
    const out = enhance(image, algo, filler)
    image = out.output
    lightPixels = out.lightPixels
  }
  return lightPixels
}

const solve = ({algo, image}) => {
  const startTime = process.hrtime()
  {
    const imageClone = JSON.parse(JSON.stringify(image))
    silver = enchanceNTimesAndGetLightPixels(imageClone, algo, 2)
  }
  {
    const imageClone = JSON.parse(JSON.stringify(image))
    gold = enchanceNTimesAndGetLightPixels(imageClone, algo, 50)
  }

  const endTime = process.hrtime(startTime)
  console.info('Execution time: %ds %dms', endTime[0], endTime[1] / 1000000)
}

solve(parseInput())

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
