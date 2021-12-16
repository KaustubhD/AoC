// Sample, not actual
const input = '620080001611562C8802118E34'

const hexToBin = (hex) => Array.from(hex)
                            .map(hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0'))
                            .join('')
                            .split('')

const readPacketVersion = (bin) => {
    if (bin.length == 0)
        return 0
    // First 3 bits
    let v = parseInt(bin.splice(0, 3).join(''), 2)
    
    // Next 3 bits
    const t = parseInt(bin.splice(0, 3).join(''), 2)
    
    if (t == 4) {
        // literal
        
        // Just prune
        while (bin.length >= 5) {
            const numBits = bin.splice(0, 5)
            if (numBits[0] == '0')
                break
        }
    }
    else {
        // operator
        
        const i = bin.splice(0, 1)
        
        if (i == '0') {
            const len = parseInt(bin.splice(0, 15).join(''), 2)
            let bitsCovered = 0
            let prevLen = bin.length
            
            while(bitsCovered != len) {
                v += readPacketVersion(bin)
                bitsCovered += prevLen - bin.length
                prevLen = bin.length
            }
            
        }
        else if (i == '1') {
            const num = parseInt(bin.splice(0, 11).join(''), 2)
            for (let it = 0; it < num; it++) {
                v += readPacketVersion(bin);
            }
        }
    }
    return v
}

console.log(readPacketVersion(hexToBin(input)))
