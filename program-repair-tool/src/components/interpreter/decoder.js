import execute from "./executor.js"
import { isNumeric } from './mips_instructions.js'
import Error from './Error.js'
import Register from './Register.js'
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
    Also worth keeping in mind is that it does not appear that the code makes any distinction between System.out.print or System.out.println, and may not even confirm if the required text after "System.out" is there.
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

        let constant = false

        if (keyword == 'final') {
            constant = true
            kw_vals[i].shift()
            keyword = kw_vals[i][0]
        }

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
                    line[1] = clipSemicolon(line[1])

                    if (Object.prototype.hasOwnProperty.call(registers, line[1])) {
                        duplicateDeclarationMessage(line[1], output)
                        return
                    }

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

                    instruction = buildLWInstruction(line[1], line[1], constant)
     
                }
                // For initializing a variable e.g. (int a = 5;)
                /* 
                The following is executed if this is an int variable being declared and initialized to a value.
                Any line with four words that starts with int will be recognized as such, so we need to keep that in mind.
                */
                else if (line.length == 4) {
                    if (Object.prototype.hasOwnProperty.call(registers, line[(line.indexOf("=")-1)])) {
                        duplicateDeclarationMessage(line[(line.indexOf("=")-1)], output)
                        return
                    }
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
                    var value = clipSemicolon(val)
                    /*
                    Once again the instruction is given the func value "lw", which is a bit of a misnomer, actually.
                    (Well, maybe not. I am a bit sleep deprived and what's important is how it works.)
                    var1 is set to the name of the variable, which precedes the = sign.
                    Uncertain why this isn't just done with line[1].
                    The instruction's value will be set to the value attribute's value if that is a number, or, if the value attribute's value is the name of a variable in registers, then that variable's value is saved as the instruction's value instead.
                    */
                    let res = substituteVariable(registers, value)
                    if (res === null) {
                        undeclaredVariableMessage(value, output)
                        return;
                    }
                    instruction = buildLWInstruction(line[(line.indexOf("=")-1)], res, constant)
                    
                }
                // For initializing a variable with the output of an expression e.g. (int a = 2 + 3; int a = b + c..)
                /*
                The following is executed if a variable is being declared and initialized to the value of an expression.
                Once again this implies certain assumptions that we should keep in mind.
                */
                else if (line.length > 4) {
                    if (Object.prototype.hasOwnProperty.call(registers, line[(line.indexOf("=")-1)])) {
                        duplicateDeclarationMessage(line[(line.indexOf("=")-1)], output)
                        return
                    }
                    /*
                    The variable expression is set by first taking only the expression portion of the line using splice, and then eliminating the semicolon from each element if one exists.
                    Once again the instruction is saved with func "lw".
                    The instruction's var1 will be the variable name, though I am uncertain why it isn't just selected with line[1].
                    The value of the instruction will be the expression. Will check on how this is used later.
                    */
                    let expression = line.splice(3,line.length-3);
                    expression[expression.length - 1] = clipSemicolon(expression[expression.length - 1])

                    instruction = buildLWInstruction(line[(line.indexOf("=")-1)], expression, constant)

                }
                break;

            /*
            The following is done in the event that the keyword is "variable".
            This keyword should not exist in normal Java code, rather it is set as the keyword on line 122 if this line begins with a variable name that exists as a variable within registers.
            The error case of a variable being set to a value when it has not yet been declared does not seem to be handled in this program, though to be fair it would not be handled at this time.
            */

            case "variable": // (c = a + b +....(+-*/))
                /*
                If the line has more than three words then it is understood to involve an expression.
                Like before, an expression variable is set to be only the expression itself, with all semicolons removed.
                Once again, the instruction's func is set to lw.
                var1 is set to the name of the attribute, uncertain why it wasn't just done with line[0], unless the code was supposed to be reused as its own function.
                It should be, as this process is repetitive.
                The instruction's value is set to be the expression.
                */
                if (line.length > 3) {
                    let expression = line.splice(2,line.length-2)
                    expression[expression.length - 1] = clipSemicolon(expression[expression.length - 1])
                    instruction = buildLWInstruction(line[(line.indexOf("=")-1)], expression, constant)
                }
                /*
                Otherwise, if the line is three words long and has the word "+=" that is not at the beginning, the following is done.
                The instruction's func is set to "addi".
                The instruction's reg_val is set to the variable name.
                The instruction's var1 is also set to the variable name.
                The instruction's var2 is set to what is being added to the variable, with any semicolons removed.
                */
                else if (line[1] == "+=" && line.length == 3) {  // Only works if line length == 3; ( num += 2 ) and ( num += num )
                    instruction = buildMathInstruction("add", line[0], line[0], clipSemicolon(line[2]))
                }   
                /*
                Otherwise, if the line contains the word "-" that is not at the beginning, the following is done.
                This is exactly the same as what begins on line 278, except it is concerned with subtraction and not addition.
                */
                else if (line[1] == "-=" && line.length == 3) {
                    instruction = buildMathInstruction("sub", line[0], line[0], clipSemicolon(line[2]))
                }
                /*
                Otherwise, if the line contains the word "*" that is not at the beginning, the following is done.
                This is similar what begins on line 278 and 309, except it is concerned with multiplication instead of addition or subtraction.
                One notable difference is that there is no check of the numericness of the operands, instead the instruction's func is just set to "mult".
                Will discover the implications of this later.
                */
                else if (line[1] == "*=" && line.length == 3) {
                    instruction = buildMathInstruction("mult", line[0], line[0], clipSemicolon(line[2]))
                }
                /*
                Otherwise, if the line contains the word "/" that is not at the beginning, the following is done.
                This is exactly the same as what begins on line 325, except it is concerned with division and not multiplication.
                */
                else if (line[1] == "/=" && line.length == 3) {
                    instruction = buildMathInstruction("div", line[0], line[0], clipSemicolon(line[2]))
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
                    instruction = buildMathInstruction("add", line[0], clipSemicolon(line[2]), 0)
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
                console.log(conditions)
                // Beginning and end of lines being executed by the for loop

                let scope = get_stack_scope(kw_vals, "for")

                if (scope === null) {
                    missingBracketMessage(output)
                    return
                }

                /*
                new_blocks_list will become an array consisting of the lines involved in the for loop.
                This object's blocks_list will be modified to contain the lines that are not part of the for loop.
                kw_vals will now hold elements that are not part of the for loop.
                */
                new_blocks_list = blocks_list.splice(scope.start, scope.len + 1)
                kw_vals.splice(scope.start, scope.len + 1)

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
                
                instruction = buildForInstruction(new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0], conditions)

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

                let scopeStats = get_stack_scope(kw_vals, "if")

                if (scopeStats === null) {
                    missingBracketMessage(output)
                    return
                }

                new_blocks_list = blocks_list.splice(scopeStats.start, scopeStats.len + 1)
                kw_vals.splice(scopeStats.start, scopeStats.len + 1)
                
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
                instruction = buildIfInstruction(new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0], conditions)

                // Storing (else if())'s following a standard if statement
                //error:unexpected lexical decalration in case block (no-case-declaraton) 294-295
                /*
                Unsure of what the above comment is talking about right now.
                else_container is used to store any instructions related to the blocks found in this process of storing any else-if or else statements that follow an if-statement.
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
                        if (scope === null) {
                            missingBracketMessage(output)
                            return
                        }
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
                        let else_if_instruction = buildIfInstruction(new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0], conditions)

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
                        if (scope === null) {
                            missingBracketMessage(output)
                            return
                        }
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
                        let else_instruction = buildElseInstruction(new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0])

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
                    It does not seem to be needed right now, but I'm leaving it commented out just in case.
                    */

                    //if (typeof(kw_vals[placeHolder]) != "object" || placeHolder > kw_vals.length) break;
                    
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
                instruction = buildPrintInstruction(print_container)
                break;

            case "}":
                closingBracketMessage(output)
                return;

            /*
            The following is executed if no previous cases occurred.
            May want to do more than just display a message to the console in this case.
            */
            default:
                console.log("Couldn't read a keyword")
                undeclaredVariableMessage(keyword, output)
                return;
            }

        //Like the old comment says, this statement keeps a list of instructions.
        instructions.push(instruction) // Keeping log of instructions - not needed honestly
        //The instruction created from the previous case is executed.
        let res = execute(instruction, registers, output)

        if (res === 'quit') {
            return;
        }
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
            break
        }
    }

    if (scope_stack.length > 0 || block_end < 1) {
        console.log("ERROR -> decode -> for -> scope stack")
        return null
    }

    return {
        start: block_start,
        end: block_end,
        len: block_end - block_start
    }
}

function clipSemicolon(word) {
    word = word.includes(';') ? word.slice(0,-1) : word
    return word
}

export function buildLWInstruction(var1, value, constant) {
    let instruction = {
        func: "lw",      
        var1: var1,
        value: value,
        constant: constant      
    };
    return instruction;
}

function buildMathInstruction(func, reg_val, var1, var2) {
    let instruction = {
        func: func,
        reg_val: reg_val,
        var1: var1,
        var2: var2
    };
    return instruction;
}

function buildForInstruction(blocks_list, conditions) {
    let instruction = {
        func: "for",
        blocks_list: blocks_list,
        conditions: conditions
    };
    return instruction;
}

function buildIfInstruction(blocks_list, conditions) {
    let instruction = {
        func: "if",
        blocks_list: blocks_list,
        conditions: conditions
    };
    return instruction;
}

function buildElseInstruction(blocks_list) {
    let instruction = {
        func: "else",
        blocks_list: blocks_list
    };
    return instruction;
}

function buildPrintInstruction(print_container) {
    let instruction = {
        func: "print",
        value: print_container
    };
    return instruction;
}

export function undeclaredVariableMessage(keyword, output) {
    output.splice(0, output.length)
    output.push(new Error("Variable " + keyword + " is undeclared.", 'undeclared variable'))
}

export function expressionSyntaxMessage(expression, output) {
    output.splice(0, output.length)
    output.push(new Error("Expression " + expression + " does not have proper syntax.", 'expression syntax'))
}

export function divideByZeroMessage(expression, output) {
    output.splice(0, output.length)
    output.push(new Error("Expression " + expression + " attempts to divide by zero.", 'divide by zero'))
}

function closingBracketMessage(output) {
    output.splice(0, output.length)
    output.push(new Error("There exists a closing curly bracket that does not match up to an opening curly bracket.", 'closing bracket'))
}

function missingBracketMessage(output) {
    output.splice(0, output.length)
    output.push(new Error("There is a missing closing curly bracket.", 'missing closing bracket'))
}

export function duplicateDeclarationMessage(variable, output) {
    output.splice(0, output.length)
    output.push(new Error("Variable " + variable + " was already declared.", 'duplicate declaration'))
}

export function alterConstantMessage(variable, output) {
    output.splice(0, output.length)
    output.push(new Error("Variable " + variable + " is a constant and cannot be altered.", 'alter constant'))
}

export function substituteVariable(registers, value) {
    console.log(value)
    if (isNumeric(value)) {
        return value;
    }
    else if (Object.prototype.hasOwnProperty.call(registers, value)) {
        return registers[value].value;
    }
    else {
        return null;
    }
}
