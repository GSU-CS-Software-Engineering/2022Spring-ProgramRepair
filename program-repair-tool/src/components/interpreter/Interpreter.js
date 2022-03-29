/*

*/
/*
This is the interpreter file.
As such, it is the most vital file in the codebase, since it is what determines Java code output.
Therefore, it is needs to be understood functionally and conceptually more than any other file.
It imports all the functions from mips_instructions.js to use for itself.
*/
import decode from './decoder.js'
import execute from './executor'


export default class Interpreter {
                
    constructor(blocks_list, registers) {
        /*
        An interpreter object's registers will be set to the registers parameter if it is not undefined.
        If the registers parameter is undefined, then the interpreter object's registers will be set to an empty object.
        The properties kept in registers will be the variables that the interpreter will keep track of.
        */
        this.registers = typeof(registers) != "undefined" ? registers : {}  // Variables that are stored and/or manipulated
        // List of code instruction blocks. Separated by line number
        // Keeps track of code to run for different scopes throughout
        // the user's program
        /*
        If the blocks_list parameter is an object then the object's blocks_list attribute will be set to the parameter's inner HTML, or the content within the HTML tags.
        See more at: https://www.w3schools.com/jsref/prop_html_innerhtml.asp
        If the blocks_list parameter is not an object then the object's block_list attribute is simply set to the parameter.
        Uncertain of the intention behind this distinction.
        In any case, blocks_list seems like it will be an array of the code blocks found within the problem.
        */
        this.blocks_list = typeof(blocks_list) == 'object' ? blocks_list.innerHTML : blocks_list 
        //This object's instructions attribute will be initialized as an empty array.
        this.instructions = []
        //This object's output attribute will be initialized as an empty array.
        this.output = []
    }

    //The run method is the entry point of execution, as it runs the fetch and decode methods.

    run() {
        /*
        The fetch and decode methods are called if this object's blocks_list is not undefined.
        If this object's blocks_list is undefined, then a message is output to the console.
        This is likely the intention that answers the uncertainty on line 29.
        */
        if (typeof this.blocks_list !== 'undefined') {
            this.fetch()
            decode(this.registers, this.blocks_list, this.instructions, this.output)
            // execute is called automatically from decode
        }
        else {
            console.log("Undefined blocks_list")
        }
        
    }
    /*
    The following method converts the blocks_list String held by the object into an array of Strings.
    The array elements are delimited by newlines in the original String.
    Each array element has any whitespace that precedes or succeeds all text removed.
    Any array element that is an empty String is removed.
    */
    fetch() { // Pull instruction from instruction components
        this.blocks_list = this.blocks_list
            .split("\n")            // Each code instruction needs to be on its own line
            .map(x => x.trim())     // Trim white space from each line
            .filter(x => {
                return x.length > 0 // Make sure empty strings aren't added to list
            })
        
    }
    
    //The following method simply returns this intepreter's output.
    get_output() {
        return this.output;
    }

    execute(instruction) {
        execute(instruction, this.registers, this.output)
    }
}