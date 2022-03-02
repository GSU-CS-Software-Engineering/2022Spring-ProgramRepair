/*
There are currently uncertainties on lines 24 and 36.
*/
//As the previously made comments state, these functions are based on MIPS instructions and are exported for Interpreter.js to use.
// MIPS instructions as functions


// Arithmetic functions
//The following functons all use parseFloat(String) which converts a String into a floating point number.
//This function adds two values and returns the sum.
export function add(val1, val2) {
    return parseFloat(val1) + parseFloat(val2)
}
//This function subtracts val2 from val1 and returns the difference.
export function sub(val1, val2) {
    return parseFloat(val1) - parseFloat(val2)
}
//This function multiplies two values and returns the product.
export function mult(val1, val2) {
    return parseFloat(val1) * parseFloat(val2)
}
/*
This function divides val1 by val2 and returns the quotient.
May want to double-check that integer division isn't being done by accident, uncertain if this happens in JavaScript.
If val2 is 0 then a String with value "Error: division by zero" is returned instead.
*/
export function div(val1, val2) {
    if (val2 == "0") return "Error: division by zero"
        return parseFloat(val1) / parseFloat(val2)
}
// Branch functions for looping
/*
The instruction beq causes a branch in execution if the two supplied values are equivalent.
See more at: https://www3.ntu.edu.sg/home/smitha/fyp_gerald/beqinstruction.html
The function below seems to simply return a boolean regarding if the supplied values are equal.
Uncertain of the semantics regarding the fact that, if both values are numeric, they are converted to floating point numbers and then compared, but they are compared as is if they are not both numeric.
Why is this?
This question repeats for other functions as well.
May discover why within Interpreter.js
*/
export function beq(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) == parseFloat(val2)
    }
    return val1 == val2
}
//This function is similar to beq except it determines is val1 is greater than val2.
export function bgt(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) > parseFloat(val2)
    }
    return val1 > val2
}
//This function determines if val1 is less than val2.
export function blt(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) < parseFloat(val2)
    }
    return val1 < val2
}
//This function determines if val1 is greater than or equal to val2.
export function bgte(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) >= parseFloat(val2)
    }
    return val1 >= val2
}
//This function determines if val1 is less than or equal to val2.
export function blte(val1, val2) {
    if (isNumeric(val1) && isNumeric(val2)){
        return parseFloat(val1) <= parseFloat(val2)
    }
    return val1 <= val2
}

// Helper
/*
This function returns true if n can successfully be converted to a number and is finite.
(the isFinite function converts n into a number if need be before determining its finiteness, so parseFloat is not needed for it)
(See more at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
*/
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
