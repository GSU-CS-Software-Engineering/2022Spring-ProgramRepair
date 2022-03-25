import execute from "./executor.js"
import { isNumeric } from './mips_instructions.js'
/*
The gargantuan function below is in charge of reading over the code line by line, creating instructions and calling the execute function on them.
We will consider breaking it down into multiple functions to make it more manageable.
We may also want to add error checking to this method.
*/
export default function decode(registers, blocks_list, instructions, output) {  // Instruction should be a component with attributes that represent registers
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
    var kw_vals = blocks_list.map( x => {
        if (x.includes("System.out")) { // Marking stdout with a keyword for the decoder to read
            return ["print", x]
        }
        var arr = x.split(/\s/)
        console.log(arr)
        return arr
    })

    /*
    The following for loop that iterates over every value of kw_vals is the remainder of this entire function, and is quite large.
    It iterates over each element of kw_vals, creating an instruction in a way dependent on the keyword found in the current element and then calling the execute method on that instruction.
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
        This is used to represent that a previously declared variable name has been detected as the first word of the current element of kw_vals.
        */

        if (Object.prototype.hasOwnProperty.call(registers, keyword)) { 
            keyword = "variable"
        }

        // Have to declare these outside of switch: for/if
        /*
        All of these variables are declared for use later.
        new_blocks_list will contain statements to be executed within a for loop or if condition, if applicable.
        conditions will be used to store conditions found in between the parentheses of a for loop or if-statement, if applicable.
        block_start will hold the line number of the first line of a for loop or if-statement, if applicable.
        block_end will hold the line number of the last line of a for loop or if-statement, if applicable.
        scope_stack will be used in order to discover the beginning and end of a for loop or if-statement block, if applicable.
        block_len will hold the length of the stack in lines, which will exclude the last line with the closing curly bracket but include the line where the for or if reserved word is used, if applicable.
        */
        let new_blocks_list;
        let conditions;
        let block_start;
        let block_end;
        var scope_stack;
        let block_len;

        /*
        This switch statement is nearly the rest of the entire function and is quite large.
        It creates an instruction in a way dependent on what keyword is.
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
                    In fact, a variable being just declared does nothing in execution, but should affect decoding somehow to keep track of what variables there are.
                    var1 contains the name of the variable being declared.
                    Uncertain why there is a value attribute when there is no value in this situation, a variable is just being declared.
                    Also uncertain why a semicolon is sought and eliminated if it exists from the second element in the line when this was already done previously.
                    That is also done very frequently, should maybe do some code reuse.
                    */
                        instruction = {
                        func: "lw",       // func should represent the function given in the instruction
                        var1: line[1],  // variable name being stored to register
                        value: line[1].indexOf(";") > 0 ? line[1].slice(0,-1) : line[1]    // value being stored to register
                
                    }
                }
                // For initializing a variable e.g. (int a = 5;)
                /* 
                The following is executed if this is an int variable being declared and initialized to a value.
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
                    var1 is set to the name of the variable, which precedes the = sign.
                    Uncertain why this isn't just done with line[1].
                    The instruction's value will be set to the value attribute's value if that is a number, or, if the value attribute's value is the name of a variable in registers, then that variable's value is saved as the instruction's value instead.
                    */
                    instruction = {
                        func: "lw",       // func should represent the function given in the instruction
                        var1: line[(line.indexOf("=")-1)],  // variable name being stored to register
                        value: (Object.prototype.hasOwnProperty.call(registers, value)) ? registers[value] : value          // value being stored to register
                    
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
                    Once again the instruction is saved with func "lw".
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
                Once again, the instruction's func is set to lw.
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
                The "add" instruction only supports adding variables.
                Otherwise, it's set to "addi".
                The "addi" instruction can add variables as well as numbers.
                Uncertain why "add" even exists then.
                The instruction's reg_val will become the variable name.
                The instruction's var1 and var2 will become the addends, with any semicolons removed from the second addend.
                At least, that seems to be the intention. There is an error, as var2 will actually be set to the operator if the second addend does not contain a semicolon.
                This piece of code is a little questionable, as no valid Java code is three words or less and has a "+" as one of those words.
                This piece of code also assumes that this line is three words long, which may be benign but should still be kept in mind.
                Will update this comment if I find anything that justifies this.
                I have not.
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
                The instruction's func is set to "addi".
                The instruction's reg_val is set to the variable name.
                The instruction's var1 is also set to the variable name.
                The instruction's var2 is set to what is being added to the variable, with any semicolons removed.
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
                The instruction's func is set to addi.
                The instruction's reg_val is set to be the name of the variable being modified.
                The instruction's var1 value depends on if registers has a property named the third word, so, if it is a variable that has been seen before.
                If it does have a property with this name, then it checks to see if the value stored in registers for the property is the same as the name of the property, as that is the third word.
                This doesn't make sense.
                In any case, if they are equivalent, then var1 will equal 0, and if not then it will equal the value that the registers property contains.
                If registers does not have a property named the third word, then the third word is just saved in var1 as is.
                This is the case if the third word is not a variable, or not a varialbe that has been seen before.
                Variables are detected and turned into their values when addi is performed anway, so var1 should just be sset to line[2], as far as I can tell.
                The instruction's var2 is set to 0, as, since this is just assigning var1 to reg_val, it is the same as reg_val = var1 + 0, so the way addi is implemented can be reused.
                Notably, semicolons do not seem to be removed here. Could be problematic.
                */
                else if (line[1] == "=" && line.length == 3) {  // Assigning a single value to a preexisting register (a = 5)

                    instruction = {
                        func: "addi",
                        reg_val: line[0],   // Register name
                        // Pretty much just analyzing the value being assigned,
                        // whether its a preexisting variable or just a value
                        var1: (Object.prototype.hasOwnProperty.call(registers, line[2])) ?
                        (registers[line[2]] == line[2] ? 0 : registers[line[2]]) : line[2],         
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
                new_blocks_list = blocks_list.splice(block_start, block_len + 1)
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
                The if block refers to all lines included in an if statement, but does not include any else-if or else statemets.
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
                new_blocks_list = blocks_list.splice(block_start, block_len + 1)
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
                Unsure of what the above comment is talking about right now.
                else_container is used to store any instructions related to the blocks found in this process of storing any else-if or else statements that follow and if-statement.
                */
                let else_container = []
                //Currently uncertain why this variable is needed in the first place.
                let placeHolder = i

                /*
                The following loop executes while kw_vals's placeHolder indexed element is not undefined, so assuming we have not gone out of bounds, and the kw_vals entry at index placeHolder has "else" at index 0.
                May want to double check if this is the way one checks if a value is undefined, or if having an out of bounds index leads to an undefined result.
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
                        //The scope object returned by the get_stack_scope method contains the calculated block start, block end, and length of the next block starting with "else", which in this case would be an else-if block.
                        let scope = get_stack_scope(kw_vals, "else")
                        /*
                        Like before, the blocks_list will now be a version of itself without the else if block lines, as will kw_vals.
                        new_blocks_list will contain the lines of the else if block.
                        */
                        new_blocks_list = blocks_list.splice(scope.start, scope.len + 1)
                        kw_vals.splice(scope.start, scope.len + 1)
                        //Also like before, the first and last elements of new_blocks_list are removed, thus leaving the statements executed inside of the else if block.
                        new_blocks_list.shift(); 
                        new_blocks_list.pop();
                        /*
                        An object called else_if_instruction is created.
                        Its func is given the value "if", as it will eventually be executed like an if statement, given that its execution is dependent on its conditions.
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
                        The instruction's else-if property is set to else_container.
                        This effectively updates the property else-if to have the value of else_container with the new block added.
                        This is a bit wasteful, as this update can be done after all blocks found are pushed to else_container, so, after the loop is done executing.
                        */
                        instruction["else-if"] = else_container
                        
                    }
                    // Else
                    //This is executed if an else block was located.
                    else {
                        // //The scope object returned by the get_stack_scope method contains the calculated block start, block end, and length of the next block starting with "else", which in this case would be an else block.
                        let scope = get_stack_scope(kw_vals, "else")
                        /*
                        Like before, the blocks_list will now be a version of itself without the else block lines, as will kw_vals.
                        new_blocks_list will contain the lines of the else block.
                        */
                        new_blocks_list = blocks_list.splice(scope.start, scope.len + 1)
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
                    If the kw_vals placeHolderth element is not an object or the placeHolder index is out of bounds, terminate this loop.
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
        instructions.push(instruction) // Keeping log of instructions - not needed honestly
        //The instruction created from the previous case is executed.
        execute(instruction, registers, output)
    }
}

/*
This method returns an object that contains the line where a block of code starts, the line where a block of code ends, as well as the block length, which is the number of lines in a block excluding the line with the closing curly bracket.
This method is almost identical to procedures done before to determine these values for a for block and an if block.
This method should be used in those cases instead of the same code being written more than once.
keyword would just be passed in as "if" or "for".
In fact, this method is more correct than what was written earlier, as it actually iterates through every word of the current line of kw_vals.
May need to add some error checking either inside of it or outside of it, in the event that block delimiters are never found.
*/
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
                    //Like the above comment says, with this implementation, closing curly brackets must be on their own line, which is probably good for readability anyway.
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
