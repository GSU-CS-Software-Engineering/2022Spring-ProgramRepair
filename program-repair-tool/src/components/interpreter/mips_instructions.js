// MIPS instructions as functions


// Arithmetic functions
export function add(val1, val2) {
    return parseFloat(val1) + parseFloat(val2)
}
export function sub(val1, val2) {
    return parseFloat(val1) - parseFloat(val2)
}
export function mult(val1, val2) {
    return parseFloat(val1) * parseFloat(val2)
}
export function div(val1, val2) {
    if (val2 == "0") return "Error: division by zero"
        return parseFloat(val1) / parseFloat(val2)
}
// Branch functions for looping
export function beq(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) == parseFloat(val2)
    }
    return val1 == val2
}
export function bgt(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) > parseFloat(val2)
    }
    return val1 > val2
}
export function blt(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) < parseFloat(val2)
    }
    return val1 < val2
}
export function bgte(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) >= parseFloat(val2)
    }
    return val1 >= val2
}
export function blte(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) <= parseFloat(val2)
    }
    return val1 <= val2
}

// Helper
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
