// Sample, not actual
const input = '04005AC33890'

const hexToBin = (hex) => Array.from(hex)
                            .map(hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0'))
                            .join('')
                            .split('')

const readLiteralPacket = (bin) => {
    
    let num = ''
    while (bin.length >= 5) {
        const numBits = bin.splice(0, 5)
        num += numBits.slice(1).join('')
        if (numBits[0] == '0')
            break
    }

    return parseInt(num, 2)
}

const evaluate = (bin) => {
    // First 3 bits
    parseInt(bin.splice(0, 3).join(''), 2)
    
    // Next 3 bits
    const t = parseInt(bin.splice(0, 3).join(''), 2)
    
    if (t == 4) {
        // literal
        return readLiteralPacket(bin, prefix)
    }
    else {
        // operator
        
        const i = bin.splice(0, 1)
        const subPackets = []
        
        if (i == '0') {
            const len = parseInt(bin.splice(0, 15).join(''), 2)
            const newBin = bin.splice(0, len)
            
            let bitsCovered = 0
            let prevLen = newBin.length
            
            while(bitsCovered != len) {
                subPackets.push(evaluate(newBin, prefix + '>'))
                bitsCovered += prevLen - newBin.length
                prevLen = newBin.length
            }
            
        }
        else if (i == '1') {
            const num = parseInt(bin.splice(0, 11).join(''), 2)
            for (let it = 0; it < num; it++) {
                subPackets.push(evaluate(bin, prefix + '>'))
            }
        }
        if (subPackets.length == 1)
            return subPackets[0]

        switch(t) {
            case 0:
                return subPackets.reduce((acc, x) => acc += x)
            case 1:
                return subPackets.reduce((acc, x) => acc *= x)
            case 2:
                return Math.min(...subPackets)
            case 3:
                return Math.max(...subPackets)
            case 5:
                return subPackets[0] > subPackets[1] ? 1 : 0
            case 6:
                return subPackets[0] < subPackets[1] ? 1 : 0
            case 7:
                return subPackets[0] == subPackets[1] ? 1 : 0
        }
    }
}

console.log(evaluate(hexToBin(input)))
