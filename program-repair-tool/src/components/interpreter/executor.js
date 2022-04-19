import * as mips from './mips_instructions.js'
import Interpreter from './Interpreter.js';
import { buildLWInstruction, substituteVariable, uninitializedVariableMessage, mathExpressionSyntaxMessage, booleanSyntaxMessage, stringSyntaxMessage, divideByZeroMessage, duplicateDeclarationMessage, alterConstantMessage, invalidIntMessage, invalidDoubleMessage ,invalidBooleanMessage, invalidStringMessage, invalidOperationMessage, collapseStrings } from './decoder.js';
import Register from './Register.js';
// Instructions execute after each instruction is decoded, so it reads and executes code from top to bottom.
/*
Like the previous comment says, this method is run after each instruction is decoded.
We may want to do all decoding first and then execute the instructions one-by-one, depending on the situation.
*/
export function execute(instruction, registers, output) {
    //The variable key is set to equal instruction, uncertain why they didn't just use the instruction parameter.
    let key = instruction
    //The following is done if func is "lw".
    if (key.func == "lw") {         // Loading value to registers

        if (key.type === null && ['final int', 'final double', 'final boolean', 'final String'].includes(registers[key.var1].type) && registers[key.var1].value !== null) {
            alterConstantMessage(key.var1, output)
            return 'quit';
        }

        if (key.type === null) {
            key.type = registers[key.var1].type
        }

        let value = null
        //If key has a numeric value, set the variable in registers with the same name as key's var1 to equal key's value.
        if (key.value === null || mips.isNumeric(key.value) || validateString(key.value)) {
           value = key.value
        }
        

        // Assigning an expression to a variable
        /*
        As the above comment states, the following is intended to run if an expression is being assigned to a variable.
        Howver, I do not see why the value's length has to be checked.
        If func is "lw", value will either be numeric or an expression.
        This could just be an else.
        Actually, "lw" can be used when a variable is just being declared, so the else if is needed here.
        However, this shows that the program does nothing when it sees a variable being declared and not initialized.
        This should be altered as a part of error checking.
        */

        else {
        
            value = evaluateGeneralExpression(key.value, registers, output)

            if (value === null) {
                return 'quit'
            }

        } 

        if (['int', 'final int'].includes(key.type)) {
            if (!validateInt(value)) {
                invalidIntMessage(key.var1, value, output)
                return 'quit'
            }
        }

        if (['double', 'final double'].includes(key.type)) {
            if (!mips.isNumeric(value)) {
                invalidDoubleMessage(key.var1, value, output)
                return 'quit'
            }
        }

        if (['boolean', 'final boolean'].includes(key.type)) {
            if (!validateBoolean(value)) {
                invalidBooleanMessage(key.var1, value, output)
                return 'quit'
            }
        }

        if (['String', 'final String'].includes(key.type)) {
            if (!validateString(value)) {
                invalidStringMessage(key.var1, value, output)
                return 'quit'
            }
        }

        console.log(value)

        registers[key.var1] = new Register(key.type, value)

    }
    /*
    The old comment states that this code piece is used for addition related to integer values and variables.
    Once again, this calls into question the existence of the previous code piece.
    A lot of this execution code appears redundant and in need of reworking.
    */
    else if (key.func == "add") {  // Flexible addition for both integer vals and variable vals
        if (['final int', 'final double'].includes(registers[key.reg_val].type)) {
            alterConstantMessage(key.reg_val, output)
            return 'quit';
        }
        let res = performMathOp(registers, key.var1, key.var2, mips.add, output)
        if (res === null) {
            return 'quit';
        }
        if (registers[key.reg_val].type == 'int' && !validateInt(res)) {
            invalidIntMessage(key.reg_val, output)
            return 'quit';
        }
        if (registers[key.reg_val].type == 'double' && !mips.isNumeric(res)) {
            invalidDoubleMessage(key.reg_val, output)
            return 'quit';
        }
        registers[key.reg_val] = new Register(registers[key.reg_val].type, res)
    }
    //The following is analogous to "addi". Roughly the same comments apply.
    else if (key.func == "sub") {  // Flexible subtraction for both integer vals and variable vals
        if (['final int', 'final double'].includes(registers[key.reg_val].type)) {
            alterConstantMessage(key.reg_val, output)
            return 'quit';
        }              
        let res = performMathOp(registers, key.var1, key.var2, mips.sub, output)
        if (res === null) {
            return 'quit';
        }
        if (registers[key.reg_val].type == 'int' && !validateInt(res)) {
            invalidIntMessage(key.reg_val, output)
            return 'quit';
        }
        if (registers[key.reg_val].type == 'double' && !mips.isNumeric(res)) {
            invalidDoubleMessage(key.reg_val, output)
            return 'quit';
        }
        registers[key.reg_val] = new Register(registers[key.reg_val].type, res)
    }
    //The following is analogous to "addi" and "subi". Roughly the same comments apply.
    else if (key.func == "mult") {  // Flexible multiplication
        if (['final int', 'final double'].includes(registers[key.reg_val].type)) {
            alterConstantMessage(key.reg_val, output)
            return 'quit';
        }
        let res = performMathOp(registers, key.var1, key.var2, mips.mult, output)
        if (res === null) {
            return 'quit';
        }
        if (registers[key.reg_val].type == 'int' && !validateInt(res)) {
            invalidIntMessage(key.reg_val, output)
            return 'quit';
        }
        if (registers[key.reg_val].type == 'double' && !mips.isNumeric(res)) {
            invalidDoubleMessage(key.reg_val, output)
            return 'quit';
        }
        registers[key.reg_val] = new Register(registers[key.reg_val].type, res)
    }
    //The following is analogous to "addi", "subi", and "mult". Roughly the same comments apply.
    else if (key.func == "div") {   // Flexible divison
        if (['final int', 'final double'].includes(registers[key.reg_val].type)) {
            alterConstantMessage(key.reg_val, output)
            return 'quit';
        }
        let res = performMathOp(registers, key.var1, key.var2, mips.div, output)
        if (res === null) {
            return 'quit';
        }
        else if (res === "Error: division by zero") {
            divideByZeroMessage(key.reg_val + " /= 0", output)
            return 'quit';
        }

        let secondInt = false

        if ((Object.prototype.hasOwnProperty.call(registers, key.var2) && registers[key.var2].type == 'int') || (!Object.prototype.hasOwnProperty.call(registers, key.var2) && validateInt(key.var2))) {
            secondInt = true
        }
        if (registers[key.reg_val].type == 'int' && secondInt) {
            Math.floor(res)
        }

        if (registers[key.reg_val].type == 'int' && !validateInt(res)) {
            invalidIntMessage(key.reg_val, output)
            return 'quit';
        }
        if (registers[key.reg_val].type == 'double' && !mips.isNumeric(res)) {
            invalidDoubleMessage(key.reg_val, output)
            return 'quit';
        }
        registers[key.reg_val] = new Register(registers[key.reg_val].type, res)
    }
    //There is a desperate need for code reuse with the above code pieces.

    //The following code piece is run if func is "for".
    else if (key.func == "for") {
        /*
        A new interpreter is created, with the blocks_list set to be the blocks in the for instruction, as these are the blocks that are within the for loop.
        This interpreter will have access to variables that the program already has as well.
        */
        let new_registers = cloneRegisters(registers)
        var for_interpreter = new Interpreter(key.blocks_list, new_registers)
        /*
        The for_interpreter's conditions are set to the conditions provided in the instruction.
        Uncertain how this is used for now.
        It doesn't appear to be used at all.
        */
        //for_interpreter['conditions'] = key.conditions
        //The variable loop_variable is set to an array containing all the words in the first element of conditions, like "int" "i" "=" "4", for example.
        var loop_variable = key.conditions[0].split(" ");
        // console.log("INSIDE FOR LOOP")
        
        // Decode for loop conditions and assign value to register
        /*
        The following creates an instruction where var1 is the variable name and value is what it should be set to, so i and 4 respectively in my previous example.
        It should be noted that this process does not account for a loop that starts like for (; i < 5; i++) {
        */
        if (Object.prototype.hasOwnProperty.call(new_registers, loop_variable[loop_variable.indexOf("=")-1])) {
            duplicateDeclarationMessage(loop_variable[loop_variable.indexOf("=")-1], output)
            return 'quit'
        }
        let res = substituteVariable(registers, loop_variable[loop_variable.indexOf("=")+1])
        if (res === null) {
            uninitializedVariableMessage(loop_variable[loop_variable.indexOf("=")+1], output)
            return 'quit'
        }
        instruction = buildLWInstruction(loop_variable[loop_variable.indexOf("=")-1], res, 'int')

        //This line executes the instruction, therefore setting the value to the variable in registers.
        for_interpreter.execute(instruction) // Loading looping variable to a register

        console.log(for_interpreter.registers[loop_variable[loop_variable.indexOf("=")-1]])
        
        // Decode the incrementer portion of condition and save it as a function to run in the while loop
        //The following function, named incrementer, performs the logic present in the third part of conditions, so in an example of for (int i = 0; i < 10; i++), it would be i++.
        let incrementer = () => {
            /*
            If the third element of conditions contains "++", the following is done.
            This may or may not be enough for our purposes.
            */
            if (key.conditions[2].includes("++")) {
                
                let res = changeByOne(key.conditions, for_interpreter.registers, mips.add, output)
                if (res === 'quit') {
                    return 'quit';
                }

            }
            /*
            The following is almost identical to the previous code piece except it's for decrementing.
            This prompts code reuse.
            */
            else if (key.conditions[2].includes("--")) {
                
                let res = changeByOne(key.conditions, for_interpreter.registers, mips.sub, output)
                if (res === 'quit') {
                    return 'quit';
                }

            }
            //If the third element of conditions includes "+=", the following is done.
            else if (key.conditions[2].includes("+=")) {
                let res = changeByMany(key.conditions, for_interpreter.registers, mips.add, output)
                if (res === 'quit') {
                    return 'quit';
                }
            }
            /*
            If the third element of conditions includes "-=", the following is done.
            This is highly similar to the previous piece of code.
            */
            else if (key.conditions[2].includes("-=")) {
                let res = changeByMany(key.conditions, for_interpreter.registers, mips.sub, output)
                if (res === 'quit') {
                    return 'quit';
                }
            }

            else if (key.conditions[2].includes("*=")) {
                let res = changeByMany(key.conditions, for_interpreter.registers, mips.mult, output)
                if (res === 'quit') {
                    return 'quit';
                }
            }

            else if (key.conditions[2].includes("/=")) {
                let res = changeByMany(key.conditions, for_interpreter.registers, mips.div, output)
                if (res === 'quit') {
                    return 'quit';
                }
            }
        }

        // Running the for loop here
        //unexpected contant condition
        //Uncertain what the above comment means as of now, will update this comment when I find out.
        while (true) {
            /*
            A new interpreter is created with this instruction's blocks_list and the main interpreter's registers.
            I thought that this could be erroneous, as another interpreter with this name was already created earlier and it had its registers altered in performing the logic of the first part of conditions.
            Then I saw, they all manipulate the same registers object, the one belonging to the main interpreter.
            The line of code below is necessary, although I am uncertain as of now why. It is most likely due to the way the interpreter executes, as well as because of the way the output is added to the overall output iteration by iteration.
            This does create some implications when it comes to how variable scope is treated with regards to for loops, we should keep our eyes on that.
            It should be noted that this also leads to a form of recursion, if a nested for loop is found then the for_interpreter will perform this exact same process within itself.
            */
            for_interpreter = new Interpreter(key.blocks_list, new_registers)
            //The interpreter is then run to generate the output of the code within the for loop.
            for_interpreter.run()
            //All of the output generated from the for_interpreter is added to the output of the main interpreter, element by element.
            if (for_interpreter.output.length > 0 && Object.prototype.hasOwnProperty.call(for_interpreter.output[0], 'errorType')) {
                output.splice(0, output.length)
                output.push(for_interpreter.output[0])
                return 'quit'
            }

            for (let i in for_interpreter.output) {
                output.push(for_interpreter.output[i])
            }
            //The incrementer function is called in order to perform the logic of the third part of conditions.
            if (incrementer() === 'quit') {
                return 'quit';
            }
            /*
            If the for loop should not continue executing, the loop is broken out of.
            May want to simplify this code by just writing while (branch()) at the top insead.
            */
            let res = branch(key.conditions, for_interpreter.registers, 'for', output)
            if (res === null) {
                return 'quit';
            }
            console.log(res)
            if (!res) {
                break;
            }
            
        }
        //When a for loop is completed, a message is output to the console.
        console.log("END FOR LOOP")
        callbackRegisters(registers, new_registers)

    }

    //The following is done if the instruction's func is "if".
    else if (key.func == "if") {
        /*
        Much like with the "for" func, a new intrepreter is created with the function's blocks_list, which in this case is all the lines within the if statement.
        This interpreter has access to the main interpreter's registers.
        The new interpreter's conditions property is set to the conditions of the instruction.
        */
        //var if_interpreter = new Interpreter(key.blocks_list, registers)
        //if_interpreter['conditions'] = key.conditions
        
        // Running the if condition and body here if condition is True
        /*
        If the if condition is true, then the code in the if block is executed and the output is added to the output of the main interpreter.
        The execute function then returns so that any else-ifs or elses are not run.
        */
        let res = branch(key.conditions, registers, 'if', output)
        if (res === null) {
            return 'quit';
        }
        if (res) {
            let new_registers = cloneRegisters(registers)
            let if_interpreter = new Interpreter(key.blocks_list, new_registers)
            if_interpreter.run()
            if (if_interpreter.output.length > 0 && Object.prototype.hasOwnProperty.call(if_interpreter.output[0], 'errorType')) {
                output.splice(0, output.length)
                output.push(if_interpreter.output[0])
                return 'quit'
            }
            for (let i in if_interpreter.output) {
                output.push(if_interpreter.output[i])
            }
            callbackRegisters(registers, new_registers)
            return
        }
        
        // Handling else-if and else
        //The following executes if the if condition was false and there exists one or more else-if conditions.
        else if (Object.prototype.hasOwnProperty.call(key, 'else-if')) {
            //The variable logic_chain is set to be the instruction's else-if object.
            let logic_chain = key['else-if']
            //Every element in logic_chain is iterated over.
            for(let i in logic_chain) {
                //The statement variable equals the element currently being iterated over.
                let statement = logic_chain[i]
                //The following is executed if the element corresponds to an else-if statement.
                if (statement.func == "if") {
                    /*
                    If that is the case and the condition of the else-if statement evaluates to true, the statement is executed and this loop terminates, as a condition was satisfied.
                    Much like with "for" func, this leads to a sort of recursion, as there can be nested if statements.
                    I am a bit uncertain exactly how this works at the moment, but it seems to be working correctly.
                    It should be noted that the current implementation leads to this statement's conditions being evaluated twice, may want to make this more efficient if possible.
                    */
                    console.log(statement.conditions)
                    let res = branch(statement.conditions, registers, 'if', output)
                    if (res === null) {
                        return 'quit';
                    }
                    if (res) {
                        execute(statement, registers, output)
                        break
                    }
                }
                //If the element corresponds to an else statement then that means that no statements before it executed, therefore it is executed instead and is presumed to be the last element.
                else if (statement.func == "else") {
                    execute(statement, registers, output)
                }
            }

        }
        
    }

    /*
    If the instruction has func "else", then it would only be sent to execute if it was appropriate for its code to run.
    Much like earlier, a new interpreter is created with this instruction's blocks_list and access to the main interpreter's registers.
    This also raises some concerns about variable scope that need looking into.
    The interpreter is run and its output is added to the main interpreter's output.
    This is repetitive, code reuse should be done.
    */
    else if (key.func == "else") {
        let new_registers = cloneRegisters(registers)
        var else_interpreter = new Interpreter(key.blocks_list, new_registers)
        else_interpreter.run()
        if (else_interpreter.output.length > 0 && Object.prototype.hasOwnProperty.call(else_interpreter.output[0], 'errorType')) {
            output.splice(0, output.length)
            output.push(else_interpreter.output[0])
            return 'quit'
        }
        for (let i in else_interpreter.output) {
            output.push(else_interpreter.output[i])
        }

        callbackRegisters(registers, new_registers)

    }


    //The following is executed if the instruction's func is "print".
    else if (key.func == "print") { // Print function on to stdout, acts as println
        //A message is displayed to the console about what is being printed.
        console.log("Printing: " + key.value)
        //A variable called content is declared.
        let content;

        // String concatenation
        /*
        If the value contains double quotes, then content becomes the text after the first set of quotes but before the second set of quotes, if there are any.
        Does not facilitate error checking or the possibility of String expressions within a print statement.
        */
        if (validateString(key.value)) {
            content = key.value.split(`"`)[1]
        }
        
        //Otherwise, if the value is numeric, content is simply set to that value.
        else if (mips.isNumeric(key.value) || validateBoolean(key.value)) {
            content = key.value
        }

        //Otherwise, if there is a variable named value, content become's that variable's value.
        else if (Object.prototype.hasOwnProperty.call(registers, key.value)) {
            content = registers[key.value].value
            console.log(content)
            if (['String', 'final String'].includes(registers[key.value].type)) {
                content = content.split(`"`)[1]
            }
        }
        // For printing expressions
        /*
        An expression would require three or more "words" separated by spaces within the print statement, so this detects if that is the case.
        Should maybe reorder this conditional statements, depending on how we change the program.
        Keep in mind the assumptions that this program is making about spacing, we need to make sure that spacing is consistent within our code blocks.
        */
        else {
            let exp = key.value.split(' ')
            exp = collapseStrings(exp)
            console.log('exp = ' + exp)
            content = evaluateGeneralExpression(exp, registers, output)

            if (content === null) {
                return 'quit'
            }

            if (validateString(content)) {
                content = content.split(`"`)[1]
            }
        } 

        /*
        Regardless of what content has become, it is added to the main interpreter's output.
        May want to add an error case if content was not given a value because none of the conditional statements executed.
        */
        output.push(content)
    }
}

function evaluateMathExpression(value, registers, output) {

    // Extracting variable values if there are any
    /*
    The following line replaces any variables in the expressions with their values and saves it in the expression variable.
    Once again this does not seem to check for the case where an unitialized variable is used.
    Perhaps we ought to include that detection in the decode method.
    */

    let expression = []
    let types = []

    for (let i = 0; i < value.length; i++) {
        if (['+', '-', '*', '/'].includes(value[i])) {
            expression.push(value[i])
            types.push(value[i])
        }
        else {

            let res = substituteVariable(registers, value[i])
            if (res == null) {

                uninitializedVariableMessage(value[i], output)
                return null
            }
            if (Object.prototype.hasOwnProperty.call(registers, value[i])) {
                if (['int', 'final int'].includes(registers[value[i]].type)) {
                    types.push('int')
                }
                else if (['double', 'final double'].includes(registers[value[i]].type)) {
                    types.push('double')
                }
            }
            else if (validateInt(res)) {
                types.push('int')
            }
            else if (mips.isNumeric(res)) {
                types.push('double')
            }
            expression.push(res)
        }
    }

    if (!/^-?[\d]+(\.[\d]+)?[+\-*/]-?[\d]+(\.[\d]+)?([+\-*/]-?[\d]+(\.[\d]+)?)*$/.test(expression.join(''))) {
        mathExpressionSyntaxMessage(expression.join(' '), output)
        return null;
    }

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
            let new_val = mips.mult(expression[i-1], expression[i+1])
            let first = types[i-1]
            let second = types[i+1]
            expression.splice(--i, 3, new_val)
            if (first === 'int' && second === 'int') {
                types.splice(i, 3, 'int')
            }
            else {
                types.splice(i, 3, 'double')
            }
        }
        else if (x == "/") {
            let res = mips.div(expression[i-1], expression[i+1]);
            if (res == "Error: division by zero") {
                divideByZeroMessage(expression.join(' '), output)
                return null;
            }
            let first = types[i-1]
            let second = types[i+1]
            if (first === 'int' && second === 'int') {
                types.splice(i, 3, 'int')
                res = Math.floor(res)
            }
            else {
                types.splice(i, 3, 'double')
            }

            let new_val = res

            expression.splice(--i, 3, new_val)
            
        }
    }

    for (let i = 0; i < expression.length; i++) {
        let x = expression[i]
        if (x == "+") {
            let new_val = mips.add(expression[i-1], expression[i+1])
            expression.splice(--i, 3, new_val)
        }
        else if (x == "-") {
            let new_val = mips.sub(expression[i-1], expression[i+1])
            expression.splice(--i, 3, new_val)
        } 
    }
    /*
    The final result, which should be all that is left in expression, is then saved to the appropriate variable.
    Uncertain why the join method is needed here, perhaps the value stored in registers needs to be a String.
    That's probably it.
    */
    return expression.join()

} 

function evaluateBooleanExpression(value, registers, output) {

    if (!Array.isArray(value)) {
        value = [value]
    }

    console.log(value)

    // Extracting variable values if there are any
    /*
    The following line replaces any variables in the expressions with their values and saves it in the expression variable.
    Once again this does not seem to check for the case where an unitialized variable is used.
    Perhaps we ought to include that detection in the decode method.
    */

    let expression = []

    for (let i = 0; i < value.length; i++) {
        if (['==', '>', '>=', '<', '<=', '&&', '||', '!', '+', '-', '*', '/'].includes(value[i])) {
            expression.push(value[i])
        }
        else {
            if(value[i][0] == '!') {

                while (value[i].length > 0 && value[i][0] == '!') {
                    value[i] = value[i].substring(1)
                    expression.push('!') 
                }

            }

            let res = substituteVariable(registers, value[i])
            if (res == null) {

                uninitializedVariableMessage(value[i], output)
                return null
            }
            expression.push(res)
        }
    }

    console.log(expression)

    let expressionString = expression.join(' ')

    for (let i = 0; i < expression.length; i++) {
        if (['+', '-', '*', '/'].includes(expression[i])) {
            if (i - 1 < 0 || i + 1 >= expression.length || !mips.isNumeric(expression[i-1]) || !mips.isNumeric(expression[i+1])) {
                booleanSyntaxMessage(expressionString, output)
                return null;
            }
            else {
                let miniExpression = [expression[i-1], expression[i], expression[i+1]]
                let res = evaluateMathExpression(miniExpression, registers, output)
                if (res === null) {
                    return null
                }
                expression.splice(i-1, 3, res)
                i--
            }
        }
    }

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == '!') {
            let negate = true
            expression.splice(i, 1)
            while (i < expression.length && expression[i] == '!') {
                negate = !negate
                expression.splice(i, 1)
            }
            if (i >= expression.length || !validateBoolean(expression[i])) {
                booleanSyntaxMessage(expressionString, output)
                return null;
            }
            else if (negate) {
                if (expression[i] == true || expression[i] == 'true') {
                    expression[i] = false
                }
                else {
                    expression[i] = true
                }
            }
        }
    }

    if (!/^(true|false|-?[\d]+(\.[\d]+)?)((>|>=|<=|<|==|&&|\|\|)(true|false|-?[\d]+(\.[\d]+)?))*$/.test(expression.join(''))) {
        booleanSyntaxMessage(expressionString, output)
        return null;
    }

    // Computing mult/div then add/sub
    /*
    The following two loops complete the math expression.
    The first loop performs any multiplication and division while the second loop performs any addition and subtraction, in accordance with the order of operations.
    */

    for (let i = 0; i < expression.length; i++) {
        //x becomes the expression element being currently iterated over.
        let x = expression[i]

        if (['==', '>', '>=', '<', '<='].includes(x)) {
            if (x == '==' && validateBoolean(expression[i-1]) && mips.isNumeric(expression[i+1])) {
                continue
            }
            let res = evaluateComparison(expression[i-1], x, expression[i+1])
            if (res === null) {
                booleanSyntaxMessage(expressionString, output)
                return null
            }

            expression.splice(--i, 3, res)

        }

    }

    for (let i = 0; i < expression.length; i++) {
        let x = expression[i]
        if (x == '==') {
            let res = evaluateComparison(expression[i-1], x, expression[i+1])
            if (res === null) {
                booleanSyntaxMessage(expressionString, output)
                return null
            }
            expression.splice(--i, 3, res)
        }
    }

    if (!/^(true|false)((&&|\|\|)(true|false))*$/.test(expression.join(''))) {
        booleanSyntaxMessage(expressionString, output)
        return null;
    }

    console.log(expression)

    for (let i = 0; i < expression.length; i++) {
        let x = expression[i]
        if (x == 'true' || x == true) {
            expression[i] = '1'
        }
        else if (x == 'false' || x == false) {
            expression[i] = '0'
        }
        else if (x == '&&') {
            expression[i] = '*'
        }
        else if (x == '||') {
            expression[i] = '+'
        }
    }

    console.log("What is given as a math expression:", expression)

    let ret = null

    if (expression.length == 1) {
        ret = expression[0]
    }

    else {
        ret = evaluateMathExpression(expression, registers, output)  
    }

    if (ret == 0) {
        return false
    }
    else if (ret !== null) {
        return true
    }
    else {
        return null
    }

} 

function evaluateStringExpression(value, registers, output) {
    let expression = []
    let references = {}
    let expressionString = value.join(' ')

    console.log("Value is: ", value)

    for (let i = 0; i < value.length; i++) {
        if (Object.prototype.hasOwnProperty.call(registers, value[i])) {
            let varType = registers[value[i]].type
            if (['String', 'final String'].includes(varType)) {
                references[i] = value[i]
                expression.push(registers[value[i]].value)
            }
            else if (['int', 'final int', 'double', 'final double', 'boolean', 'final boolean'].includes(varType)) {
                expression.push(convertToString(registers[value[i]].value))
            }
        }
        else {
            if (validateString(value[i]) || ['+', '+='].includes(value[i])) {
                expression.push(value[i])
            }
            else if (validateBoolean(value[i]) || mips.isNumeric(value[i])) {
                expression.push(convertToString(value[i]))
            }
            else if (value[i][0] == '!') {
                let count = 0
                while (value[i][0] == '!') {
                    count++
                    value[i] = value[i].substring(1)
                }
                if (validateBoolean(value[i]) || Object.prototype.hasOwnProperty.call(registers, value[i])) {
                    for (let c = 0; c < count; c++) {
                        value[i] = '!' + value[i]
                    }
                    let ret = evaluateBooleanExpression(value[i], registers, output)
                    console.log("ret is ", ret)
                    if (ret === null) {
                        return null
                    }
                    expression.push(convertToString(ret))
                }
            }
            else {
                stringSyntaxMessage(expressionString, output)
                return null
            }
        }
    }

    expressionString = expression.join(' ')

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == '+' || expression[i] == '+=') {
            if (i == 0 || i == expression.length - 1 || !validateString(expression[i-1]) || !validateString(expression[i+1])) {
                stringSyntaxMessage(expressionString, output)
                return null
            }
            
            if (expression[i] == '+') {
                delete references[i-1]
                delete references[i+1]
                let newString = concatenate(expression[i-1], expression[i+1])
                expression.splice(--i, 3, newString)
                references = updateReferences(references, i)
            }

            else {
                if (!Object.hasOwnProperty.call(references, i-1)) {
                    stringSyntaxMessage(expressionString, output)
                    return null
                }
                else {
                    let newString = concatenate(expression[i-1], expression[i+1])
                    registers[references[i-1]].value = newString
                    delete references[i-1]
                    expression.splice(--i, 3, newString)
                    references = updateReferences(references, i)
                }
            }
        }
    }

    if (expression.length != 1) {
        stringSyntaxMessage(expressionString, output)
        return null
    }
    else {
        return expression.join()
    }

}

function concatenate(str1, str2) {
    str1 = str1.substring(1).slice(0,-1)
    str2 = str2.substring(1).slice(0,-1)
    return '"' + str1 + str2 + '"'
}

function updateReferences(references, deletionPoint) {
    let newReferences = {}
    for (const index in references) {
        if (index >= deletionPoint) {
            newReferences[index - 2] = references[index]
        }
        else {
            newReferences[index] = references[index]
        }
    }
    return newReferences
}

function convertToString(value) {
    return '"' + value + '"'
}

function evaluateGeneralExpression(expression, registers, output) {
    let res = null

    if (!Array.isArray(expression)) {
        expression = [expression]
    }

    let expType = 'math'
    
    for (let i = 0; i < expression.length; i++) {
        if (expression[i].includes('"') || (Object.prototype.hasOwnProperty.call(registers, expression[i]) && ['String', 'final String'].includes(registers[expression[i]].type))) {
            expType = 'String'
            break
        }
    }

    if (expType != 'String') {
        for (let i = 0; i < expression.length; i++) {
            if (['>', '>=', '<', '<=', '==', '&&', '||', 'true', 'false'].includes(expression[i]) || expression[i] == true | expression[i] == false || expression[i].includes('!') || (Object.prototype.hasOwnProperty.call(registers, expression[i]) && ['boolean', 'final boolean'].includes(registers[expression[i]].type))) {
                expType = 'boolean'
                break
            }
        }
    }

    if (expType == 'math') {
        res = evaluateMathExpression(expression, registers, output)
    }
    else if (expType == 'boolean') {
        res = evaluateBooleanExpression(expression, registers, output)
        console.log(res)
    }
    else if (expType == 'String') {
        res = evaluateStringExpression(expression, registers, output)
    }

    return res

}
function performMathOp(registers, var1, var2, operation, output) {
    // Next 2 lines checks which code entries are integers vs a preexisting register value (variable)
    /*
    I'm not even sure if the above comment is right but I doubt it.
    Instead, if var1 or var2 is numeric, then val1 or val2 should just be set to that number.
    Otherwise, val1 or val2 should be set to the value of the variable with var1 or var2's name.
    In general, keen awareness should be maintained of what this program is currently capable of.
    */
    let val1 = substituteVariable(registers, var1) 
    let val2 = substituteVariable(registers, var2)

    if (!mips.isNumeric(val1)) {
        invalidOperationMessage(val1, output)
    }
    if (!mips.isNumeric(val2)) {
        invalidOperationMessage(val2, output)
    }
    if (val2 === null) {
        uninitializedVariableMessage(val2, output)
        return null;
    }  
    return operation(val1, val2)
}

function changeByOne(conditions, registers, operation, output) {
    let line = []
    if (operation.name == 'add') {
        line = conditions[2]
        .trim()
        .split("++")
        .filter(x => {      // Making sure no empty elements are added to the instruction line
            return x.length > 0
        })
    }
    else {
        line = conditions[2]
        .trim()
        .split("--")
        .filter(x => {      // Making sure no empty elements are added to the instruction line
            return x.length > 0
        })
    }
    
    /*
    If line is not one element, an error message is displayed to the console.
    May want to do more than that in case this happens.
    */
    if (line.length != 1) {
        console.log("Error with incrementer in for loop")
    }
    else if (!Object.prototype.hasOwnProperty.call(registers, line[0])) {
        uninitializedVariableMessage(line[0], output)
        return 'quit';
    }
    else if (['final int', 'final double'].includes(registers[line[0]].type)) {
        alterConstantMessage(line[0], output)
        return 'quit';
    }
    else if (!mips.isNumeric(registers[line[0]].value)) {
        invalidOperationMessage(registers[line[0]].value, output)
        return 'quit';
    }

    //The variable is incremented within registers, as is appropriate.
    registers[line[0]] = new Register('int', operation(registers[line[0]].value, 1))
}

function changeByMany(conditions, registers, operation, output) {
    /*
    Just like before, line becomes an array that contains the words of the third element of conditions, barring "+=".
    This is a key opportunity for code reuse.
    */
    let line = []
    if (operation.name == 'add') {
        line = conditions[2]
        .trim()
        .split("+=")
        .filter(x => {      // Making sure no empty elements are added to the instruction line
            return x.length > 0
        })
    }
    else if (operation.name == 'sub') {
        line = conditions[2]
        .trim()
        .split("-=")
        .filter(x => {      
            return x.length > 0
        })
    }
    else if (operation.name == 'mult') {
        line = conditions[2]
        .trim()
        .split("*=")
        .filter(x => {      
            return x.length > 0
        })
    }
    else {
        line = conditions[2]
        .trim()
        .split("/=")
        .filter(x => {      
            return x.length > 0
        })
    }


    //There is an error if line is not two elements long, as it should contain the addends.
    if (line.length != 2) {
        console.log("Error with incrementer in for loop")
    }
    
    // Check if we're incrementing by a number or by another variables value
    //As the old comment says, if inc_value is a variable, then its value is substituted in.
    let res = substituteVariable(registers, line[1])
    if (res === null) {
        uninitializedVariableMessage(line[1], output)
        return 'quit'
    }

    line[1] = res

    //The addition is performed here.

    if (!Object.prototype.hasOwnProperty.call(registers, line[0])) {
        uninitializedVariableMessage(line[0], output)
        return 'quit'
    }
    else if (['final int', 'final double'].includes(registers[line[0]].type)) {
        alterConstantMessage(line[0], output)
        return 'quit';
    }

    if (!mips.isNumeric(registers[line[0]].value)) {
        invalidOperationMessage(registers[line[0]].value, output)
        return 'quit';
    }

    if (!mips.isNumeric(line[1])) {
        invalidOperationMessage(line[1], output)
        return 'quit';
    }

    let value = operation(registers[line[0]].value, line[1])

    if (value === "Error: division by zero") {
        divideByZeroMessage(line[0] + " /= 0", output)
        return 'quit';
    }

    if (operation.name == 'div') {
        let secondInt = false

        if ((Object.prototype.hasOwnProperty.call(registers, line[1]) && registers[line[1]].type == 'int') || (!Object.prototype.hasOwnProperty.call(registers, line[1]) && validateInt(line[1]))) {
            secondInt = true
        }
        if (registers[line[0]].type == 'int' && secondInt) {
            Math.floor(value)
        }
    }

    if (registers[line[0]].type == 'int' && !validateInt(value)) {
        invalidIntMessage(line[0], output)
        return 'quit';
    }
    if (registers[line[0]].type == 'double' && !mips.isNumeric(value)) {
        invalidDoubleMessage(line[0], output)
        return 'quit';
    }


    registers[line[0]] = new Register(registers[line[0]].type, value) // Incrementing conditional value
}

function branch(conditions, registers, type, output) {
    /*
    line becomes an array consisting of the words in the second part of the for loop.
    Uncertain why trim() is needed to remove leading and trailing whitespace.
    */
   let line;
    if (type == 'if') {
        line = conditions.trim().split(" ")
    }
    else if (type == 'for') {
        line = conditions[1].trim().split(" ")
    }
    else {
        console.log("Error: Unknown use of branch()")
    }
    /*
    If the first word is a variable (that registers has), register becomes its value.
    Otherwise, which assumes it is something other than a variable, register is just set to that.
    */
    console.log(conditions)
    
    return evaluateBooleanExpression(line, registers, output)
    
}

function cloneRegisters(registers) {
    return JSON.parse(JSON.stringify(registers));
}

function callbackRegisters(registers, new_registers) {
    for (const variable in registers) {
        registers[variable].value = new_registers[variable].value
    }
}

function validateInt(input) {
    return /^-?[\d]+$/.test(input)
}

export function validateBoolean(input) {
    return input == 'true' || input == 'false' || input == true || input == false
}

export function validateString(input) {
    return /^"[^"]*"$/.test(input)
}

function evaluateComparison(op1, operator, op2) {
    let numericOp = null
    if (mips.isNumeric(op1) && mips.isNumeric(op2)) {
        numericOp = true
    }
    else if (validateBoolean(op1) && validateBoolean(op2)) {
        numericOp = false
    }
    else {
        return null
    }
    switch(operator) {
        case "<":
            if (!numericOp) {
                return null
            }
            return mips.blt(op1, op2)
        case ">":
            if (!numericOp) {
                return null
            }
            return mips.bgt(op1, op2)
        case "<=":
            if (!numericOp) {
                return null
            }
            return mips.blte(op1, op2)
        case ">=":
            if (!numericOp) {
                return null
            }
            return mips.bgte(op1, op2)       
        case "==":
            if (numericOp) {
                return mips.beq(op1, op2)
            }
            else {
                return op1 == op2
            }
        default:
            console.log("default branch case on operator: " + operator)
            return null

    }
}