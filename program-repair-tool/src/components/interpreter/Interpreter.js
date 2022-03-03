/*

*/
/*
This is the interpreter file.
As such, it is the most vital file in the codebase, since it is what determines Java code output.
Therefore, it is needs to be understood functionally and conceptually more than any other file.
It imports all the functions from mips_instructions.js to use for itself.
*/
import * as mips from './mips_instructions.js'


export class Interpreter {
                
    constructor(blocks_list, registers) {
        /*
        An interpreter object's registers will be set to the registers parameter if it is not undefined.
        If the registers parameter is undefined, then the interpreter object's registers will be set to an empty object.
        They seem to be the variables that the interpreter will keep track of, uncertain of how these are placed in as of now.
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
        If this object's blocks_list is undefined, the a message is output to the console.
        This is likely the intention that answers the uncertainty on line 29.
        Uncertain if the comparison to determine if blocks_list is undefined is correct, should test to confirm.
        */
        if (typeof this.blocks_list !== 'undefined') {
            this.fetch()
            this.decode()
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
    /*
    Given the gargantuan size of this function, I am unsure of its overall functioning, will update this comment later.
    Depending on how it's structured, we may consider breaking it down into multiple functions to make it more manageable.
    */
    decode() {  // Instruction should be a component with attributes that represent registers
                // and extract the values from them as well as the function being performed
                // Load values into registers

        // Split each code line up into keywords and values by white space
        /*
        The following creates an array and stores it as kw_vals by applying an element-wise conditional statement on this object's blocks_list.
        If the element includes the text "System.out" then its corresponding element in kw_vals will be an array consisting of the String "print" and the original value of the element.
        Otherwise, the corresponding element in kw_vals becomes an array of elements, where each element in it is a "word" in the original element, and words are delimited by spaces.
        This is actually done incorrectly, as it only works properly if words are separated by one space only.
        Uncertain if this will be an actual problem, since we should have control over how code blocks are formatted, but it's worth keeping in mind.
        Also worth keeping in mind is that it does not appear that the code makes any distinction between System.out.print or System.out.println, and may even confirm if the required text after "System.out" is there.
        Uncertain if this will be an issue either, considering our control over what code can be submitted.
        */
        var kw_vals = this.blocks_list.map( x => {
            if (x.includes("System.out")) { // Marking stdout with a keyword for the decoder to read
                return ["print", x]
            }
            var arr = x.split(/\s/)
            console.log(arr)
            return arr
        })

        /*
        The following for loop that iterates over every value of kw_vals is the remainder of this entire function, and is quite large.
        As such I do not yet know its entire functionality, will update this comment once I do.
        */

        for (let i = 0; i < kw_vals.length; i++) {        // Go through each line given in the problem
            //A variable named keyword is set to equal the first word of the current line of code.
            var keyword=kw_vals[i][0]   // Keyword = first word on a line
            //A variable named line is set to equal the current line of code for convenience.
            let line = kw_vals[i]
            //A variable named instruction is initialized to an empty object.
            var instruction = {} 

            // Trying to check if register has a variable already exists and execute accordingly
            // This should also prevent variable initialization errors.
            /*
            If this object's registers attribute has a property with the same name as the value of keyword, then keyword is set to have value "variable".
            I am very uncertain of what the intention of this is, especially since the registers attribute will always be an empty object at first given the way the interpreter is called in DragInput.vue
            Perhaps the registers attribute will change throughout the loop, will update this comment after I find out.
            */

            if (Object.prototype.hasOwnProperty.call(this.registers, keyword)) { 
                keyword = "variable"
            }

            // Have to declare these outside of switch: for/if
            /*
            All of these variables are declared for use later.
            Uncertain of their functionality yet, will update this comment once that can be determined.
            */
            let new_blocks_list;
            let conditions;
            let block_start;
            let block_end;
            var scope_stack;
            let block_len;

            /*
            Uncertain of the overall functionality of this switch statement, as it is nearly the rest of the entire function and is quite large.
            Will update this comment once I know.
            */

            switch (keyword) {

                //The following is done in the event that keyword is "int".
            
                case "int":     //  LOAD WORD: Copy from memory to register
                 
                    // For declaring a variable e.g. (int a;)
                    //The following is executed if this is an int variable being declared.
                    if (line.length == 2 && !isNumeric(line[1])) {
                        /*
                        This statement slices off the semicolon from the end of the second element if it exists within it.
                        This selection statement may not be needed for our project, since our code blocks will likely have semicolons whenever appropriate.
                        This type of statement is done a lot within the code, so I won't repeat this, but it should be done differently.
                        indexOf will return -1 if the substring does not exist within the String, not 0.
                        It returning 0 would indicate that a semicolon exists at the beginning of the String, which would be odd but is still a case.
                        Instead the includes method should be used for this.
                        See here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
                        */
                        line[1] = line[1].indexOf(";") > 0 ? line[1].slice(0,-1) : line[1]

                        /*
                        The instruction object is populated with attributes and values.
                        lw stands for load word, and can be learned about here: https://www3.ntu.edu.sg/home/smitha/fyp_gerald/lwinstruction.html
                        This doesn't seem to exactly be loading a word from anywhere, as a variable is just being declared.
                        Uncertain as to how the organization is affected with the func being "lw", will look into this.
                        var1 contains the name of the variable being declared.
                        Uncertain why there is a value attribute when there is no value in this situation, a variable is just being declared.
                        Also uncertain why a semicolon is sought and eliminated if it exists from the second element in the line when this was already done previously.
                        */
                            instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[1],  // variable name being stored to register
                            value: line[1].indexOf(";") > 0 ? line[1].slice(0,-1) : line[1]    // value being stored to register
                    
                        }
                    }
                    // For initializing a variable e.g. (int a = 5;)
                    /* 
                    The following is executed if this is an int variable being declared and initialized to a simple value.
                    Any line with four words that starts with int will be recognized as such, so we need to keep that in mind.
                    */
                    else if (line.length == 4) {
                        /*
                        The variable val is set to the value the variable is being initialized to.
                        Uncertain why it is done this way as opposed to just "var val = line[3]"
                        This way of doing things makes implicit some assumptions about the code, assumptions we need to be aware of.
                        */
                        var val = line[line.indexOf("=") + 1]
                        /*
                        The variable value is set to val with its semicolon eliminated if it has one, or just val if it does not.
                        Uncertain why the variable val was not reused here.
                        */
                        var value = val.indexOf(";") > 0 ? val.slice(0,-1) : val
                        /*
                        Once again the instruction is given the func value "lw", which is a bit of a misnomer, actually.
                        (Well, maybe not. I am a bit sleep deprived and what's important is how it works.)
                        Will need to investigate that.
                        var1 is set to the name of the variable, which precedes the = sign.
                        Uncertain why this isn't just done with line[1].
                        The instruction's value is set to the the value attribute, unless the registers object has a property with the same name as value's value, in which case, the instruction's value will be the value as the registers' value for its property named as value's value.
                        Needless to say, this is immensely confusing, but even when you understand it, it still does not make sense.
                        I see no reason why registers would have a property named a value, it would make far more sense if it had a property named the variable name.
                        Indeed, this does no check to see if this variable was previously declared, which would cause an error.
                        Absolutely uncertain of the design of this code and its implications, will definitely have to revisit it after perusing more of the code.
                        */
                        instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[(line.indexOf("=")-1)],  // variable name being stored to register
                            value: (Object.prototype.hasOwnProperty.call(this.registers, value)) ? this.registers[value] : value          // value being stored to register
                        
                        }
                        
                    }
                    // For initializing a variable with the output of an expression e.g. (int a = 2 + 3; int a = b + c..)
                    /*
                    The following is executed if a variable is being declared and initialized to the value of an expression.
                    Once again this implies certain assumptions that we should keep in mind.
                    */
                    else if (line.length > 4) {
                        /*
                        The variable expression is set by first taking only the expression portion of the line using splice, and then eliminating the semicolon from each element if one exists.
                        Once again the instruction is saved with func "lw", uncertain why this is done, may need to change this later.
                        The instruction's var1 will be the variable name, though I am uncertain why it isn't just selected with line[1].
                        The value of the instruction will be the expression. Will check on how this is used later.
                        */
                        let expression = line
                            .splice(3,line.length-3)
                            .map(x => { return x.indexOf(";") > 0 ? x.slice(0,-1) : x });

                        instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[(line.indexOf("=")-1)],  // variable name being stored to register
                            value: expression
                        }
                    }
                    break;

                /*
                The following is done in the event that the keyword is "variable".
                This keyword should not exist in normal Java code, rather it is set as the keyword on line 122 if this line begins with a variable name that exists as a variable within registers.
                The error case of a variable being set to a value when it has not yet been declared does not seem to be handled in this program, though to be fair it would not be handled at this time.
                */

                case "variable": // (c = a + b +....(+-*/))
                    //This variable, indexOfOperator, is set to 0 at first, and will be used later.
                    var indexOfOperator = 0
                    /*
                    If the line has more then three words then it is understood to involve an expression.
                    Like before, an expression variable is set to be only the expression itself, with all semicolons removed.
                    Once again, uncertain why the instruction's func is set to lw.
                    var1 is set to the name of the attribute, uncertain why it wasn't just done with line[0], unless the code was supposed to be reused as its own function.
                    It should be, as this process is repetitive.
                    The instruction's value is set to be the expression.
                    */
                    if (line.length > 3) {
                        let expression = line
                            .splice(2,line.length-2)
                            .map(x => { return x.indexOf(";") > 0 ? x.slice(0,-1) : x });
                        instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[(line.indexOf("=")-1)],  // variable name being stored to register
                            value: expression          // expression getting calculated, then being stored to register      
                        }
                    }
                    /*
                    Otherwise, the following is done if the line contains a word "+", that is not at the beginning of the line.
                    The indexOfOperator variable is set to the index of "+".
                    If neither addend is numeric, the instruction's func is set to "add".
                    Otherwise, it's set to "addi".
                    Uncertain what this means as of now, will update this comment later.
                    The instruction's reg_val will become the variable name.
                    The instruction's var1 and var2 will become the addends, with any semicolons removed from the second addend.
                    At least, that seems to be the intention. There is an error, as var2 will actually be set to the operator if the second addend does not contain a semicolon.
                    This piece of code is a little questionable, as no valid Java code is three words or less and has a "+" as one of those words.
                    This piece of code also assumes that this line is three words long, which may be benign but should still be kept in mind.
                    Will update this comment if I find anything that justifies this.
                    */
                    else if (line.indexOf("+") > 0) { // check if we need to use add or addi function
                        indexOfOperator = line.indexOf("+")
                        instruction = {
                            func: (!isNumeric(line[indexOfOperator-1]) &&
                                   !isNumeric(line[indexOfOperator+1]))? "add": "addi",
                            reg_val: line[0],   // register that will be added to
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") > 0 ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator]       // operand 2
                        }
                    }
                    /*
                    Otherwise, if the line is three words long and has the word "+=" that is not at the beginning, the following is done.
                    The instruction's func is set to "addi", possibly implying that addi specifies adding an integer to a variable.
                    The instruction's reg_val is set to the variable name.
                    The instruction's var1 is also set to the variable name.
                    The instruction's var2 is set to the integer being added to the variable, with any semicolons removed.
                    It should be noted that this code may not account for the case of something like "a += b" if it is supposing that there will always be a number after to +=.
                    Will update this comment and clear everything up after I find out about "addi".
                    */
                    else if (line.indexOf("+=") > 0 && line.length == 3) {  // Only works if line length == 3; ( num += 2 ) and ( num += num )
                        instruction = {
                            func: "addi",
                            reg_val: line[0],
                            var1: line[0],
                            var2: line[2].indexOf(";") > 0 ? line[2].slice(0,-1) : line[2]
                        }
                    }   
                    /*
                    Otherwise, if the line contains the word "-" that is not at the beginning, the following is done.
                    This is exactly the same as what begins on line 278, except it is concerned with subtraction and not addition.
                    */
                    else if (line.indexOf("-") > 0) {
                        indexOfOperator = line.indexOf("-")
                        instruction = {
                            func: (!isNumeric(line[indexOfOperator-1]) && 
                                   !isNumeric(line[indexOfOperator+1]))? "sub": "subi",
                            reg_val: line[0],   // register that will be hold substracted value
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator+1]       // operand 2
                        }
                    }
                    /*
                    Otherwise, if the line contains the word "*" that is not at the beginning, the following is done.
                    This is similar what begins on line 278 and 309, except it is concerned with multiplication instead of addition or subtraction.
                    One notable difference is that there is no check of the numericness of the operands, instead the instruction's func is just set to "mult".
                    Will discover the implications of this later.
                    */
                    else if (line.indexOf("*") > 0) {
                        indexOfOperator = line.indexOf("*")
                        instruction = {
                            func: "mult",
                            reg_val: line[0],
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator+1]       // operand 2
                        }
                    }
                    /*
                    Otherwise, if the line contains the word "/" that is not at the beginning, the following is done.
                    This is exactly the same as what begins on line 325, except it is concerned with division and not multiplication.
                    */
                    else if (line.indexOf("/") > 0) {
                        indexOfOperator = line.indexOf("/")
                        instruction = {
                            func: "div",
                            reg_val: line[0], 
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator+1]       // operand 2
                        }
                    }          
                    /*
                    Otherwise, if the second word is "=" and the line is three words long, the following is done.
                    This is assumed to be simply assigning a value to an already declared variable.
                    Once again, I have not seen error checking for if the variable has not been declared yet.
                    The instruction's func is set to addi, uncertain why this is the case right now.
                    The instruction's reg_val is set to be the name of the variable being modified.
                    The instruction's var1 value depends on if registers has a property named the third word, so, if it is a variable that has been seen before.
                    If it does have a property with this name, then it checks to see if the value stored in registers for the property is the same as the name of the property, as that is the third word.
                    This doesn't make sense.
                    In any case, if they are equivalent, then var1 will equal 0, and if not then it will equal the value that the registers property contains.
                    If registers does not have a property named the third word, then the third word is just saved in var1 as is.
                    This is the case if the third word is not a variable, or not a varialbe that has been seen before.
                    The instruction's var2 is set to 0, I am uncertain why this is done, but it likely has to do with the definition of "addi".
                    Notably, semicolons do not seem to be removed here. Could be problematic.
                    */
                    else if (line[1] == "=" && line.length == 3) {  // Assigning a single value to a preexisting register (a = 5)

                        instruction = {
                            func: "addi",
                            reg_val: line[0],   // Register name
                            // Pretty much just analyzing the value being assigned,
                            // whether its a preexisting variable or just a value
                            var1: (Object.prototype.hasOwnProperty.call(this.registers, line[2])) ?
                            (this.registers[line[2]] == line[2] ? 0 : this.registers[line[2]]) : line[2],         
                            var2: 0                 // adding zero in order to set var1 as value
                            
                        }
                    }
                    /*
                    Otherwise there is presumed to be an error, and the line's contents are logged to the console with an error message.
                    We should perhaps change this behavior later.
                    */
                    else  {
                        console.log("Error: " + line)
                    }
                    break;

                /*
                The following is done if the keyword is "for".
                */
                case "for":
                    /*
                    line is set to be a String consisting of all the words separated by spaces.
                    This is so that the content within the parentheses can be retrieved.
                    */
                    line = line.join(' ')
                    // Getting everything between the parentheses
                    //The following retrieves the text between the parentheses and delimites each piece by semicolons, storing it in the conditions variable.
                    conditions = line.split("(")[1].split(")")[0].split(";")
                    // Beginning and end of lines being executed by the for loop

                    /*
                    block_start will contain the line number where this for loop starts.
                    block_end will contain the line number where this for loop ends.
                    The first line is line 0, in this case.
                    scope_stack will be used to keep track of what level of nesting there is, in the event that there are nested loops.
                    new_blocks_list will eventually contain the statements executed within the for loop.
                    */
                    block_start = 0;
                    block_end = 0;
                    scope_stack = [];
                    new_blocks_list = [];
                    // Support for nested loops
                    /*
                    This loop iterates over all values of kw_vals.
                    Its function is to find a for loop and determine its beginning and ending lines.
                    Its current implementation is dubious, as it begins from the start of kw_vals when it should start at the current line, wasting time.
                    It is also dubious because only the first for loop will be recognized this way, causing errors.
                    */
                    for (let j in kw_vals) {
                        
                       //If the current element includes the word "for" and the scope_stack is empty, push an opening curly bracket to the scope_stack and set block_start to the current line number, then move on to the next element of kw_vals.

                        if (kw_vals[j].includes("for") && scope_stack.length == 0) {
                            scope_stack.push("{")
                            block_start = parseInt(j)
                            continue
                        }

                        //Otherwise, if the scope_stack is not empty, the following is done.

                        else if(scope_stack.length > 0) {
                            /*
                            This loop should iterate over every word in the current line of kw_vals.
                            It does not appear to actually do this, as line only contains information for the line where the intial for was encountered.
                            */
                            for (let k in line) {
                                console.log(kw_vals[j][k])
                                /*
                                If the word is a closing curly bracket, pop an element from scope_stack.
                                If the scope_stack is now empty, block_end will be set to the number of this line and the loop will stop executing.
                                */
                                if (kw_vals[j][k] == "}") {
                                    scope_stack.pop()
                                    if (scope_stack.length == 0) {
                                        block_end = parseInt(j)
                                        break;
                                    }
                                }
                                //Otherwise, if the word is an opening curly bracket, push an opening curly bracket to the scope_stack.
                                else if (kw_vals[j][k] == "{"){
                                    scope_stack.push("{")
                                }
                            }
                        }

                        //If the block_end has been found, terminate execution of this loop.

                        if (block_end > 0) {
                            break;
                        }
                    }

                    /*
                    If the scope_stack is not empty or the block_end has not been found, or it was found at line 0, either could be implied by it being 0, an error message is displayed.
                    Actually, it seems impossible for block_end to be found at line 0.
                    Should perhaps terminate execution of the function in this case, or do something else instead of just displaying an error message.
                    */

                    if (scope_stack.length > 0 || block_end < 1) {
                        console.log("ERROR -> decode -> for -> scope stack")

                    }

                    // Removes for loop instructions from being added to the main instruction list
                    /*
                    The block's length is calculated as the ending line minus the starting line.
                    I am uncertain what is counted as being part of the block.
                    If it's all statements that are executed as a part of the for loop, this calculation is incorrect.
                    If it's all statements that are executed as a part of the for loop as well as the foor loop declaration itself, this calculation is correct.
                    It seems to be the latter.
                    */
                    block_len = block_end - block_start

                    /*
                    new_blocks_list will become an array consisting of the lines involved in the for loop.
                    This object's blocks_list will be modified to contain the lines that are not part of the for loop.
                    kw_vals will now hold elements that are not part of the for loop.
                    */
                    new_blocks_list = this.blocks_list.splice(block_start, block_len + 1)
                    kw_vals.splice(block_start, block_len + 1)

                    // Need to stay on the same index for the next iteration
                    //As the old comment says, now that lines have been removed from kw_vals, the current index is actually the next line to be read, so it needs to be decremented so it will not be skipped.
                    i--; 
                    //This line removes the first element from new_blocks_list.
                    new_blocks_list.shift(); 
                    //This line removes the last element from new_blocks_list.
                    new_blocks_list.pop();

                    //After the two statements above, new_blocks_list consists of only the statements executed within the for loop.

                    /*
                    instruction's func is set to "for".
                    If new_blocks_list has more than one element, instruction's blocks_list is set to a String with each element separated by newline.
                    Otherwise, instruction's block_list is set to the sole element of new_blocks_list.
                    This could be assuming that new_blocks_list cannot be empty, which is indeed possible if the student makes a mistake.
                    We should keep an eye on this, I am uncertain if there could be some inconsistencies.
                    This instruction's conditions is set to the conditions array.
                    */
                   
                    
                    instruction = {
                        func: "for",
                        blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                        conditions: conditions
                    }

                    break;

                /*
                The following is done if the keyword is "if".
                */

                case "if":  // Decoding if statements
                     /*
                    line is set to be a String consisting of all the words separated by spaces.
                    This is so that the content within the parentheses can be retrieved.
                    */
                    line = line.join(' ')
                    // Getting everything between the parentheses
                    //As the old comment says, conditions will hold the text retrieved from in between the parentheses.
                    conditions = line.split("(")[1].split(")")[0]

                    // Beginning and end of lines being executed by the for loop
                    /*
                    Assuming that this will be similar to for loop decoding-
                    block_start will be the line number where the if block starts.
                    block_end will be the line number where the if block ends.
                    The first line will be line 0, in this case.
                    scope_stack will be used to keep track of the nesting of if statements.
                    new_blocks_list will eventually contain the statements withtin the if block.
                    Uncertain what will be considered the if block for the time being.
                    */
                    block_start = 0
                    block_end = 0
                    scope_stack = [];
                    new_blocks_list = [];

                    /*
                    This loop is tasked with finding the if block beginning and end.
                    It iterates over ever element of kw_vals.
                    It seems to suffer from the same problem as the loop that does the same thing for for-loop decoding.
                    It starts at the beginning a kw_vals which is inefficient.
                    It always stops after the first if block, making any subsequent ones unreachable.
                    */
                    for (let j in kw_vals) {

                        //If the current element includes the word "if" and the scope_stack is empty, push an opening curly bracket to the scope_stack and set block_start to the current line number, then continue to the next iteration of the loop.

                        if (kw_vals[j].includes("if") && scope_stack.length == 0) {
                            scope_stack.push("{")
                            block_start = parseInt(j)
                            continue
                        }

                        //Otherwise, if the scope_stack is not empty, do the following.

                        else if(scope_stack.length > 0) {
                            /*
                            This loop iterates over every element in line.
                            Once again, I believe this is a mistake and that it should iterate over every element in the current line, not the line variable.
                            The line variable seems to only contain information regarding where the initial "if" was encountered.
                            */
                            for (let k in line) {
                                /*
                                If the current element is a closing curly bracket, pop an element from scope_stack.
                                If scope_stack is now empty, block_end will be set to the line number of this line and the execution of this loop will be terminated.
                                */
                                if (kw_vals[j][k] == "}") {    // } need their own line
                                    scope_stack.pop()
                                    if (scope_stack.length == 0) {
                                        block_end = parseInt(j)
                                        break;
                                    }
                                }
                                //Otherwise, if the current element is an opening curly bracket, push a curly bracket to scope_stack.
                                else if (kw_vals[j][k]=="{"){
                                    scope_stack.push("{")
                                }
                            }
                        }

                        //If the block_end has been found, terminate execution of this loop.

                        if (block_end > 0) {
                            break;
                        }
                    }

                    /*
                    If the scope_stack is not empty or block_end has not been found, display an error message on the console.
                    Again, we may want to terminate execution of the entire function if this happens, or do something else other than just displaying a message.
                    */

                    if (scope_stack.length > 0 || block_end < 1) {
                        console.log("ERROR -> decode -> if -> scope stack")

                    }

                    // Removes if instructions from being added to the main instruction list
                    /*
                    The block_len is calculated the same way it was with the for blocks.
                    blocks_list becomes a version of itself without the lines of the if statement.
                    new_blocks_list is the lines of the if statment.
                    kw_vals becomes a version of itself without the entries of the if statement.
                    */
                    block_len = block_end - block_start
                    new_blocks_list = this.blocks_list.splice(block_start, block_len + 1)
                    kw_vals.splice(block_start, block_len + 1)
                    
                    // Getting rid of if statement and the closing bracket
                    //Like the old comment says, the two statments below will eliminate the first and last elements of new_blocks_list, leaving only the statements inside the if block.
                    new_blocks_list.shift(); 
                    new_blocks_list.pop();

                    /*
                    The instruction's func attribute will be set to "if".
                    If new_blocks_list has more than one element, instruction's blocks_list is set to a String with each element separated by newline.
                    Otherwise, instruction's block_list is set to the sole element of new_blocks_list.
                    This could be assuming that new_blocks_list cannot be empty, which is indeed possible if the student makes a mistake.
                    We should keep an eye on this, I am uncertain if there could be some inconsistencies.
                    This instruction's conditions is set to the conditions array.
                    */
                        
                    instruction = {
                        func: "if",
                        blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                        conditions: conditions
                    }
                    // Storing (else if())'s following a standard if statement
                    //error:unexpected lexical decalration in case block (no-case-declaraton) 294-295
                    /*
                    Unsure of what the above comments are talking about right now.
                    else_container is used to store any instructions related to the blocks found in this process.
                    */
                    let else_container = []
                    //Currently uncertain why this variable is needed in the first place.
                    let placeHolder = i

                    /*
                    The following loop executes while kw_vals's placeHolder indexed element is not undefined, so assuming we have not gone out of bounds, and the kw_vals entry at index placeHolder has "else" at index 0.
                    May want to double check if this is the way once checks if a value is undefined, or if having an out of bounds index leads to an undefined result.
                    Keep in mind that placeHolder and i don't need to be incremented, since when a block is removed from kw_vals, what takes its place in index i is the next line after it.
                    */

                    while (typeof(kw_vals[placeHolder]) !== 'undefined' && kw_vals[placeHolder].indexOf("else") == 0) {
                        // Else-if
                        /*
                        The following executes if the second element of the element of kw_vals indexed at i, so the current element, does not have a second element that is an opening curly brace.
                        This identifies it as an else if statement, as an else statement would have the openeing curly brace as its second word.
                        */
                        if (kw_vals[i][1] != "{") {
                            /*
                            The variable line is equal to kw_vals's ith element joined into a String, where elements are separated by spaces.
                            This is done in order to retrieve the conditions between the parentheses, which is done with the following statement.
                            */
                            let line = kw_vals[i].join(' ')
                            conditions = line.split("(")[1].split(")")[0]
                            //I have not reviewed how this get_stack_scope function works yet, will update this comment when I do.
                            let scope = get_stack_scope(kw_vals, "else")
                            /*
                            Like before, the blocks_list will now be a version of itself without the else if block lines, as will kw_vals.
                            new_blocks_list will contain the lines of the else if block.
                            */
                            new_blocks_list = this.blocks_list.splice(scope.start, scope.len + 1)
                            kw_vals.splice(scope.start, scope.len + 1)
                            //Also like before, the first and last elements of new_blocks_list are removed, thus leaving the statements executed inside of the else if block.
                            new_blocks_list.shift(); 
                            new_blocks_list.pop();
                            /*
                            An object called else_if_instruction is created.
                            Its func is given the value "if", and I am uncertain why this is the case for the moment.
                            If new_blocks_list has more than one element, else_if_instruction's blocks_list is set to a String with each element separated by newline.
                            Otherwise, else_if_instruction's block_list is set to the sole element of new_blocks_list.
                            This could be assuming that new_blocks_list cannot be empty, which is indeed possible if the student makes a mistake.
                            We should keep an eye on this, I am uncertain if there could be some inconsistencies.
                            else_if_instruction's conditions is set to the conditions array.
                            */
                            let else_if_instruction = {
                                func: "if",
                                blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                                conditions: conditions
                            }
                            //Add the else_if_instruction to the else_container.
                            else_container.push(else_if_instruction)
                            /*
                            The instruction's else-if propert is set to else_container.
                            Uncertain of the semantics behind how this works for the moment.
                            */
                            instruction["else-if"] = else_container
                            
                        }
                        // Else
                        //This is executed if an else block was located.
                        else {
                            //I have not reviewed how this get_stack_scope function works yet, will update this comment when I do.
                            let scope = get_stack_scope(kw_vals, "else")
                            /*
                            Like before, the blocks_list will now be a version of itself without the else block lines, as will kw_vals.
                            new_blocks_list will contain the lines of the else block.
                            */
                            new_blocks_list = this.blocks_list.splice(scope.start, scope.len + 1)
                            kw_vals.splice(scope.start, scope.len + 1)
                            //Like before, the following two statements will remove the first and last elements from new_blocks_list, leaving only the statements executed within the else block.
                            new_blocks_list.shift(); 
                            new_blocks_list.pop();
                            /*
                            An object called else_instruction is created.
                            else_instruction's func attribute is set to "else".
                            If new_blocks_list has more than one element, else_instruction's blocks_list is set to a String with each element separated by newline.
                            Otherwise, else_instruction's block_list is set to the sole element of new_blocks_list.
                            This could be assuming that new_blocks_list cannot be empty, which is indeed possible if the student makes a mistake.
                            We should keep an eye on this, I am uncertain if there could be some inconsistencies.
                            */
                            let else_instruction = {
                                func: "else",
                                blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                            }
                            //Add else_instruction to else_container
                            else_container.push(else_instruction)
                            /*
                            instruction's else-if property is set to else_container
                            This loop is terminated, as an else statement was found.
                            */
                            instruction["else-if"] = else_container
                            break;
                        }

                        /*
                        The kw_vals placeHolderth element is not an object or the placeHolder index is out of bounds, terminate this loop.
                        I am certainly uncertain why this is done.
                        See notes above this loop as to why.
                        */

                        if (typeof(kw_vals[placeHolder]) != "object" || placeHolder > kw_vals.length) break;
                        
                    }

                     // Need to stay on the same index for the next iteration
                     //Like the old comment says, the index i must be the same after this iteration to account for where the next unread line is.
                    i--;
                    break;

                /*
                The following is done if the print keyword is found.
                This keyword should not be in any valid Java code, rather it is added in this program, if "System.out" is seen.
                */
                case "print":


                    //The variable print_container is set to be the content in between the parentheses, or what is to be printed.    
                    var print_container = line[1].split("(")[1].split(")")[0]
                    /*
                    instruction's func is set to "print".
                    Its value is set to be print_container.
                    */
                    instruction = {
                        func: "print",       // func should represent the function given in the instruction
                        value: print_container
                    }
                    break;

                /*
                The following is executed if no previous cases occurred.
                May want to do more than just display a message to the console in this case.
                */
                default:
                    console.log("Couldn't read a keyword")
                    break;
                }

            //Like the old comment says, this statement keeps a list of instructions.
            this.instructions.push(instruction) // Keeping log of instructions - not needed honestly
            //The instruction created from the previous case is executed.
            this.execute(instruction)
        }
    }

    // Instructions execute after each instruction is decoded, so it reads and executes code from top to bottom.
    /*
    Like the previous comment says, this method is run after each instruction is decoded.
    We may want to do all decoding first and then execute the instructions one-by-one, depending on the situation.
    */
    execute(instruction) {
        //The variable key is set to equal instruction, uncertain why they didn't just use the instruction parameter.
        let key = instruction
        //The following is done if func is "lw".
        if (key.func == "lw") {         // Loading value to registers
            //If key has a numeric value, set the variable in registers with the same name as key's var1 to equal key's value.
            if (isNumeric(key.value)) {
                this.registers[key.var1] = key.value
            }
            

            // Assigning an expression to a variable
            /*
            As the above comment states, the following is intended to run if an expression is being assigned to a variable.
            Howver, I do not see why the value's length has to be checked.
            If func is "lw", value will either be numeric or an expression.
            This could just be an else.
            */

            else if (key.value.length > 2) {

                // Extracting variable values if there are any
                /*
                The following line replaces any variables in the expressions with their values and saves it in the expression variable.
                Once again this does not seem to check for the case where an unitialized variable is used.
                Perhaps we ought to include that detection in the decode method.
                */
                let expression = key.value.map(x => Object.prototype.hasOwnProperty.call(this.registers, x) ? this.registers[x] : x);
                // Computing mult/div then add/sub
                /*
                The following two loops complete the math expression.
                The first loop performs any multiplication and division while the second loop performs any addition and subtraction, in accordance with the order of operations.
                */
                for (let i = 0; i < expression.length; i++) {
                    //x becomes the expression element being currently iterated over.
                    let x = expression[i]
                    /*
                    If the multiplication sign is seen, then multiplication is performed on the numbers on either side.
                    The product is rounded to the nearest integer. May want to change this later.
                    The result is then substituted into the expression, replacing where the operands and multiplication symbol were.
                    It should be noted that this way of evaluating expressions assumes that they are properly formatted, which may not be the case.
                    We may need to check for that.
                    This same process is done for division, addition, and subtraction.
                    Potential for code reuse.
                    */
                    if (x == "*") {
                        let new_val = Math.round(mips.mult(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                    }
                    else if (x == "/") {
                        let new_val = Math.round(mips.div(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                        
                     }
                }
                for (let i = 0; i < expression.length; i++) {
                    let x = expression[i]
                    if (x == "+") {
                        let new_val = Math.round(mips.add(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                    }
                    else if (x == "-") {
                        let new_val = Math.round(mips.sub(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                     } 
                }
                /*
                The final result, which should be all that is left in expression, is then saved to the appropriate variable.
                Uncertain why the join method is needed here, perhaps the value stored in registers needs to be a String.
                */
                this.registers[key.var1] = expression.join()
            } 
 
        }
        /*
        As the old comment states, this pice of code is intended for adding variables together.
        While this piece of code is well written, its use is highly questionable considering where the "add" func is used in the decode method.
        */
        else if (key.func == "add") {   // Used for adding VARIABLES ONLY 
            //reg_val is the name of the variable to save the result to.
            let register_name = key.reg_val
            let val1 = this.registers[key.var1]
            let val2 = this.registers[key.var2]
            //Once again, the result is rounded for some reason.
            let new_val = Math.round(mips.add(val1, val2))
            //The result is stored in the appropriate variable.
            this.registers[register_name] = new_val
        }
        /*
        The old comment states that this code piece is used for addition related to integer values and variables.
        Once again, this calls into question the existence of the previous code piece.
        A lot of this execution code appears redundant and in need of reworking.
        */
        else if (key.func == "addi") {  // Flexible addition for both integer vals and variable vals
            let register_name = key.reg_val
            // Next 2 lines checks which code entries are integers vs a preexisting register value (variable)
            /*
            I'm not even sure if the above comment is right but I doubt it.
            Instead, if var1 or var2 is numeric, then val1 or val2 should just be set to that number.
            Otherwise, val1 or val2 should be set to the value of the variable with var1 or var2's name.
            In general, keen awareness should be maintained of what this program is currently capable of.
            */
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]  
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.add(val1, val2))
            this.registers[register_name] = new_val
        }
        //The following is analogous to "add". Roughly the same comments apply.
        else if (key.func == "sub") {   // Used for subtracting VARIABLES ONLY
            let register_name = key.reg_val
            let val1 = this.registers[key.var1]
            let val2 = this.registers[key.var2] 
            let new_val = Math.round(mips.sub(val1, val2))             
            this.registers[register_name] = new_val
        }
        //The following is analogous to "addi". Roughly the same comments apply.
        else if (key.func == "subi") {  // Flexible subtraction for both integer vals and variable vals
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.sub(val1, val2))                
            this.registers[register_name] = new_val
        }
        //The following is analogous to "addi" and "subi". Roughly the same comments apply.
        else if (key.func == "mult") {  // Flexible multiplication
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.mult(val1, val2))           
            this.registers[register_name] = new_val
        }
        //The following is analogous to "addi", "subi", and "mult". Roughly the same comments apply.
        else if (key.func == "div") {   // Flexible divison
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2]
            let new_val = Math.round(mips.div(val1, val2))               
            this.registers[register_name] = new_val
        }
        //There is a desperate need for code reuse with the above code pieces.


        else if (key.func == "for") {
            var for_interpreter = new Interpreter(key.blocks_list, this.registers)
            for_interpreter['conditions'] = key.conditions
            var loop_variable = key.conditions[0].split(" ");
            // console.log("INSIDE FOR LOOP")
            
            // Decode for loop conditions and assign value to register
            instruction = {
                func: "lw",       // func should represent the function given in the instruction
                var1: loop_variable[loop_variable.indexOf("=")-1],  // variable name being stored to register
                value: loop_variable[loop_variable.indexOf("=")+1]
            }
            for_interpreter.execute(instruction) // Loading looping variable to a register

            // Determine when to branch and what comparison to make
            let branch = () => {
                let line = key.conditions[1].trim().split(" ")
                let register = (Object.prototype.hasOwnProperty.call(for_interpreter.registers, line[0])) ? for_interpreter.registers[line[0]] : line[0]  // variable assigned to register ('i' in most cases)
                let operator = line[1]  // Should be a comparison operator
                let comparator = (Object.prototype.hasOwnProperty.call(for_interpreter.registers, line[2])) ? for_interpreter.registers[line[2]] : line[2]// Operand 2
                
                switch(operator) {
                    case "<":
                        return mips.blt(register, comparator)
                    case ">":
                        return mips.bgt(register, comparator)
                    case "<=":
                        return mips.blte(register, comparator)
                    case ">=":
                        return mips.bgte(register, comparator)       
                    case "==":
                        return mips.beq(register, comparator)
                    default:
                        console.log("for loop operator default: " + operator)
                        break;

                }
            }
            
            // Decode the incrementer portion of condition and save it as a function to run in the while loop
            let incrementer = () => {
                if (key.conditions[2].includes("++")) {
                    let line = key.conditions[2]
                        .trim()
                        .split("++")
                        .filter(x => {      // Making sure no empty elements are added to the instruction line
                            return x.length > 0
                        })
                    if (line.length != 1) {
                        console.log("Error with incrementer in for loop")
                    }
                    var loop_var = line[0]
                    for_interpreter.registers[loop_var] = mips.add(for_interpreter.registers[loop_var], 1)
                }
                else if (key.conditions[2].includes("--")) {
                    let line = key.conditions[2]
                        .trim()
                        .split("--")
                        .filter(x => {      // Making sure no empty elements are added to the instruction line
                            return x.length > 0
                        })
                    if (line.length != 1) {
                        console.log("Error with incrementer in for loop")
                    }
                    let loop_var = line[0]
                    for_interpreter.registers[loop_var] = mips.sub(for_interpreter.registers[loop_var], 1)
                }
                else if (key.conditions[2].includes("+=")) {
                    let line = key.conditions[2]
                        .trim()
                        .split("+=")
                        .filter(x => {      // Making sure no empty elements are added to the instruction line
                            return x.length > 0
                        })
                    if (line.length != 2) {
                        console.log("Error with incrementer in for loop")
                    }
                    let loop_var = line[0]
                    var inc_value = line[1]
                   
                    // Check if we're incrementing by a number or by another variables value
                    if (!isNumeric(inc_value) && Object.prototype.hasOwnProperty.call(for_interpreter.registers, inc_value)) {
                        inc_value = for_interpreter.registers[inc_value]
                    }

                    for_interpreter.registers[loop_var] = mips.add(for_interpreter.registers[loop_var], inc_value) // Incrementing conditional value
                }
                else if (key.conditions[2].includes("-=")) {
                    let line = key.conditions[2]
                        .trim()
                        .split("-=")
                        .filter(x => {      // Making sure no empty elements are added to the instruction line
                            return x.length > 0
                        })
                    if (line.length != 2) {
                        console.log("Error with incrementer in for loop")
                    }
                    let loop_var = line[0]
                    //previosuly defined variable
                    var inc_value = line[1]

                    console.log(loop_var + "   " + inc_value)
                    // Check if we're incrementing by a number or by another variables value
                    if (!isNumeric(inc_value) &&  Object.prototype.hasOwnProperty.call(for_interpreter.registers, inc_value)) {
                        inc_value = for_interpreter.registers[inc_value]
                    }
                    for_interpreter.registers[loop_var] = mips.sub(for_interpreter.registers[loop_var], inc_value)
                }
            }

            // Running the for loop here
            //unexpected contant condition
            while (true) {
                
                for_interpreter = new Interpreter(key.blocks_list, this.registers)
                for_interpreter.run()
                for (let i in for_interpreter.output) {
                    this.output.push(for_interpreter.output[i])
                }
                incrementer()
                if (!branch()) {
                    break;
                }
                
            }
            console.log("END FOR LOOP")

        }
        else if (key.func == "if") {
            var if_interpreter = new Interpreter(key.blocks_list, this.registers)
            if_interpreter['conditions'] = key.conditions
            
            // Determine when to branch and what comparison to make
            let branch = (conditions) => {
                let line = conditions.trim().split(" ")

                let register = (Object.prototype.hasOwnProperty.call(if_interpreter.registers, line[0])) ? if_interpreter.registers[line[0]] : line[0]  // variable assigned to register ('i' in most cases)
                let operator = line[1]  // Should be a comparison operator
                let comparator = (Object.prototype.hasOwnProperty.call(if_interpreter.registers, line[2])) ? if_interpreter.registers[line[2]] : line[2]// Operand 2
                
                switch(operator) {
                    case "<":
                        return mips.blt(register, comparator)
                    case ">":
                        return mips.bgt(register, comparator)
                    case "<=":
                        return mips.blte(register, comparator)
                    case ">=":
                        return mips.bgte(register, comparator)       
                    case "==":
                        return mips.beq(register, comparator)
                    default:
                        console.log("if operator default")
                        break;

                }
            }
            
            // Running the if condition and body here if condition is True
            if (branch(if_interpreter['conditions'])) {
                if_interpreter = new Interpreter(key.blocks_list, this.registers)
                if_interpreter.run()
                for (let i in if_interpreter.output) {
                    this.output.push(if_interpreter.output[i])
                }
                return
            }
            
            // Handling else-if and else
            else if (Object.prototype.hasOwnProperty.call(key, 'else-if')) {
                let logic_chain = key['else-if']
                for(let i in logic_chain) {
                    let statement = logic_chain[i]
                    if (statement.func == "if") {
                        if (branch(statement.conditions)) {
                            this.execute(statement)
                            break
                        }
                    }
                    else if (statement.func == "else") {
                        this.execute(statement)
                    }
                }

            }
            
        }
        else if (key.func == "else") {
            var else_interpreter = new Interpreter(key.blocks_list, this.registers)
            else_interpreter.run()
            for (let i in else_interpreter.output) {
                this.output.push(else_interpreter.output[i])
            }


        }
        else if (key.func == "print") { // Print function on to stdout, acts as println
            console.log("Printing: " + key.value)
            let content;

            // String concatenation
            if (key.value.indexOf(`"`) >= 0) {
                content = key.value.split(`"`)[1]
            }
            else if (isNumeric(key.value)) {
                content = key.value
            }
            else if (Object.prototype.hasOwnProperty.call(this.registers, key.value)) {
                content = this.registers[key.value]
            }
            // For printing expressions
            else if (key.value.split(' ').length > 2) {

                // Extracting variable values if there are any
                let expression = key.value.split(' ').map(x => Object.prototype.hasOwnProperty.call(this.registers, x) ? this.registers[x] : x);
                // Computing mult/div then add/sub
                for (let i = 0; i < expression.length; i++) {
                    let x = expression[i]
                    if (x == "*") {
                        let new_val = Math.round(mips.mult(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                    }
                    else if (x == "/") {
                        let new_val = Math.round(mips.div(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                        
                     }
                }
                for (let i = 0; i < expression.length; i++) {
                    let x = expression[i]

                    if (x == "+") {
                        let new_val = Math.round(mips.add(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                    }
                    else if (x == "-") {
                        let new_val = Math.round(mips.sub(expression[i-1], expression[i+1]))
                        expression.splice(--i, 3, new_val)
                     } 
                }
                content = expression.join()
            } 
            this.output.push(content)
        }
    }
    get_output() {
        return this.output;
    }
}

    // Other helper functions
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function get_stack_scope(kw_vals, keyword) {
    let block_start = 0
    let block_end = 0
    var scope_stack = [];
    for (let j in kw_vals) {

        if (kw_vals[j].includes(keyword) && scope_stack.length == 0) {
            scope_stack.push("{")
            block_start = parseInt(j)
            continue
        }
        else if(scope_stack.length > 0) {
            for (let k in kw_vals[j]) {
                if (kw_vals[j][k] == "}") {    // } need their own line
                    scope_stack.pop()
                    if (scope_stack.length == 0) {
                        block_end = parseInt(j)
                        break;
                    }
                }
                else if (kw_vals[j][k]=="{"){
                    scope_stack.push("{")
                }
            }
        }
        if (block_end > 0) {
            return {
                    start: block_start,
                    end: block_end,
                    len: block_end - block_start
                
            };
        }
    }
    return {
        start: block_start,
        end: block_end,
        len: block_end - block_start
    }
}
