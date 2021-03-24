const stdSymbols = [
    "ɑː",
    "æ",
    "ʌ",
    "ɔː",
    "eə",
    "aʊ",
    "ə",
    "aɪ",
    "e",
    // "ɜː",
    "eɪ",
    "ɪ",
    "ɪə",
    "iː",
    "ɒ",
    "əʊ",
    // "ɒɪ",
    "ʊ",
    "uː",
    "ʊə",
    "b",
    "tʃ",
    "d",
    "ð",
    "f",
    "g",
    "h",
    "dʒ",
    "k",
    "l",
    "m",
    "n",
    "ŋ",
    "p",
    "r",
    "s",
    "ʃ",
    "t",
    "θ",
    "v",
    "w",
    "j",
    "z",
    "ʒ",
    "dr",
    "dz",
    "tr",
    "ts",
]
const xfSymbols = [
    "aa",
    "ae",
    "ah",
    "ao",
    "ar",
    "aw",
    "ax",
    "ay",
    "eh",
    // "er",
    "ey",
    "ih",
    "ir",
    "iy",
    "oo",
    "ow",
    // "oy",
    "uh",
    "uw",
    "ur",
    "b",
    "ch",
    "d",
    "dh",
    "f",
    "g",
    "hh",
    "jh",
    "k",
    "l",
    "m",
    "n",
    "ng",
    "p",
    "r",
    "s",
    "sh",
    "t",
    "th",
    "v",
    "w",
    "y",
    "z",
    "zh",
    "dr",
    "dz",
    "tr",
    "ts",
]

let getStdSymbol = function (xf) {
    let idx = xfSymbols.indexOf(xf)
    if (idx >= 0) {
        return stdSymbols[idx]
    } else {
        return false
    }
}
let getXfSymbol = function (std) {
    let idx = stdSymbols.indexOf(std)
    if (idx >= 0) {
        return xfSymbols[idx]
    } else {
        return false
    }
}
let getRandomSymbol = function () {
    const idx = Math.floor(Math.random() * 46)
    let std = stdSymbols[idx], xf = xfSymbols[idx]
    return {
        std: std,
        xf: xf
    }
}

export {
    getStdSymbol,
    getXfSymbol,
    getRandomSymbol
}