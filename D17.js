const parseInput = (input) => {
    const matches = input.matchAll(/x=(.+), y=(.+)$/g)
    let variables = []
    
    for (const match of matches) {
        variables.push(...(match[1].split('..').map(Number)))
        variables.push(...(match[2].split('..').map(Number)))    
    }
    
    return variables
}

const isPassed = (x, y) => {
    return (x > xMax || y < yMin)
}

const isIn = (x, y) => {
    return (x >= xMin && x <= xMax && y >= yMin && y <= yMax)
}

const brute = () => {
    let maxHeight = -1
    let count = 0
    for (let x = 1; x <= xMax; x++) {
        for (let y = -10000; y <= 10000; y++) {
            let xPos = 0, yPos = 0, xVel = x, yVel = y
            let maxHeightThisThrow = -1
            
            Loop1: while (!isPassed(xPos, yPos)) {
                if (isIn(xPos, yPos)) {
                    count++
                    maxHeight = Math.max(maxHeightThisThrow, maxHeight)
                    break Loop1
                }
                maxHeightThisThrow = Math.max(maxHeightThisThrow, yPos)
                
                xPos += xVel
                yPos += yVel
                
                xVel = Math.max(0, xVel - 1)
                yVel--
            }
        }
    }
    console.log('Silver: ' + maxHeight)
    console.log('Gold: ' + count)
}


const [xMin, xMax, yMin, yMax] = parseInput('target area: x=20..30, y=-10..-5')

brute()
