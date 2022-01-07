const input = require('./input06').input

let silver, gold

const parseInput = (inp) => {
  /*
    3: {
      times: 1,
      children: 0
    }
  */
  return inp.split(',').map(Number).reduce((acc, fish) => {
    if(acc[fish]) {
      acc[fish]['times']++
    }
    else {
      acc[fish] = {
        times: 1,
        children: 0
      }
    }
    return acc
  }, {})
}


const lifeGoesOn = (fishTimer, days) => {
  const key = fishTimer + ',' + days
  if(offSpringProductionRecord[key])
    return offSpringProductionRecord[key]
  if (fishTimer > days)
    return 1
  let children = 1
  
  for(let day = 1; day <= days; day++) {
    if(fishTimer == 0) {
      fishTimer = 6
      children += lifeGoesOn(8, days - day)
    }
    else {
      fishTimer--
    }
  }
  offSpringProductionRecord[key] = children
  return children
}

const offSpringProductionRecord = {}

const solve = (data, days) => {
  let pond = JSON.parse(JSON.stringify(data))
  for (let key in pond) {
    pond[key].children = lifeGoesOn(parseInt(key), days)
  }
  return Object.values(pond).reduce((acc, fish) => acc += fish.children * fish.times, 0)
}

silver = solve(parseInput(input), 80)
gold = solve(parseInput(input), 256)

console.log('Silver: ' + silver)
console.log('Gold: ' + gold)
