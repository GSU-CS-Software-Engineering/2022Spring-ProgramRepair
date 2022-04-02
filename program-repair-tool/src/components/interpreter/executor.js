import * as mips from './mips_instructions.js'
import Interpreter from './Interpreter.js';
import { buildLWInstruction, substituteVariable, undeclaredVariableMessage } from './decoder.js';
import Error from './Error.js'
// Instructions execute after each instruction is decoded, so it reads and executes code from top to bottom.
/*
Like the previous comment says, this method is run after each instruction is decoded.
We may want to do all decoding first and then execute the instructions one-by-one, depending on the situation.
*/
export default function execute(instruction, registers, output) {
    //The variable key is set to equal instruction, uncertain why they didn't just use the instruction parameter.
    let key = instruction
    //The following is done if func is "lw".
    if (key.func == "lw") {         // Loading value to registers
        //If key has a numeric value, set the variable in registers with the same name as key's var1 to equal key's value.
        if (mips.isNumeric(key.value)) {
            registers[key.var1] = key.value
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

        else if (key.value.length > 2) {
            let res = evaluateExpression(key.value, registers, output)
            if (res === null) {
                return 'quit'
            }
        
            registers[key.var1] = res

        } 

        else if (key.value.length == 1) {
            registers[key.var1] = null
        }

    }
    /*
    The old comment states that this code piece is used for addition related to integer values and variables.
    Once again, this calls into question the existence of the previous code piece.
    A lot of this execution code appears redundant and in need of reworking.
    */
    else if (key.func == "add") {  // Flexible addition for both integer vals and variable vals
        let res = performMathOp(registers, key.var1, key.var2, mips.add)
        if (res === null) {
            undeclaredVariableMessage(key.var2, output)
            return 'quit';
        }
        registers[key.reg_val] = res
    }
    //The following is analogous to "addi". Roughly the same comments apply.
    else if (key.func == "sub") {  // Flexible subtraction for both integer vals and variable vals              
        let res = performMathOp(registers, key.var1, key.var2, mips.sub)
        if (res === null) {
            undeclaredVariableMessage(key.var2, output)
            return 'quit';
        }
        registers[key.reg_val] = res
    }
    //The following is analogous to "addi" and "subi". Roughly the same comments apply.
    else if (key.func == "mult") {  // Flexible multiplication
        let res = performMathOp(registers, key.var1, key.var2, mips.mult)
        if (res === null) {
            undeclaredVariableMessage(key.var2, output)
            return 'quit';
        }
        registers[key.reg_val] = res
    }
    //The following is analogous to "addi", "subi", and "mult". Roughly the same comments apply.
    else if (key.func == "div") {   // Flexible divison
        let res = performMathOp(registers, key.var1, key.var2, mips.div)
        if (res === null) {
            undeclaredVariableMessage(key.var2, output)
            return 'quit';
        }
        registers[key.reg_val] = res
    }
    //There is a desperate need for code reuse with the above code pieces.

    //The following code piece is run if func is "for".
    else if (key.func == "for") {
        /*
        A new interpreter is created, with the blocks_list set to be the blocks in the for instruction, as these are the blocks that are within the for loop.
        This interpreter will have access to variables that the program already has as well.
        */
        var for_interpreter = new Interpreter(key.blocks_list, registers)
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
        let res = substituteVariable(registers, loop_variable[loop_variable.indexOf("=")+1])
        if (res === null) {
            undeclaredVariableMessage(loop_variable[loop_variable.indexOf("=")+1], output)
            return 'quit'
        }
        instruction = buildLWInstruction(loop_variable[loop_variable.indexOf("=")-1], res)

        //This line executes the instruction, therefore setting the value to the variable in registers.
        for_interpreter.execute(instruction) // Loading looping variable to a register
        
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
            for_interpreter = new Interpreter(key.blocks_list, registers)
            //The interpreter is then run to generate the output of the code within the for loop.
            for_interpreter.run()
            //All of the output generated from the for_interpreter is added to the output of the main interpreter, element by element.
            if (Object.prototype.hasOwnProperty.call(for_interpreter.output[0], 'errorType')) {
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
            if (!res) {
                break;
            }
            
        }
        //When a for loop is completed, a message is output to the console.
        console.log("END FOR LOOP")

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
            let if_interpreter = new Interpreter(key.blocks_list, registers)
            if_interpreter.run()
            if (Object.prototype.hasOwnProperty.call(if_interpreter.output[0], 'errorType')) {
                output.splice(0, output.length)
                output.push(if_interpreter.output[0])
                return 'quit'
            }
            for (let i in if_interpreter.output) {
                output.push(if_interpreter.output[i])
            }
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
        var else_interpreter = new Interpreter(key.blocks_list, registers)
        else_interpreter.run()
        if (Object.prototype.hasOwnProperty.call(else_interpreter.output[0], 'errorType')) {
            output.splice(0, output.length)
            output.push(else_interpreter.output[0])
            return 'quit'
        }
        for (let i in else_interpreter.output) {
            output.push(else_interpreter.output[i])
        }


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
        if (key.value.indexOf(`"`) >= 0) {
            content = key.value.split(`"`)[1]
        }
        
        //Otherwise, if the value is numeric, content is simply set to that value.
        else if (mips.isNumeric(key.value)) {
            content = key.value
        }

        //Otherwise, if there is a variable named value, content become's that variable's value.
        else if (Object.prototype.hasOwnProperty.call(registers, key.value)) {
            content = registers[key.value]
        }
        // For printing expressions
        /*
        An expression would require three or more "words" separated by spaces within the print statement, so this detects if that is the case.
        Should maybe reorder this conditional statements, depending on how we change the program.
        Keep in mind the assumptions that this program is making about spacing, we need to make sure that spacing is consistent within our code blocks.
        */
        else if (key.value.split(' ').length > 2) {
            let res = evaluateExpression(key.value.split(' '), registers, output)
            if (res === null) {
                return 'quit';
            }
            content = res
        } 

        else {
            undeclaredVariableMessage(key.value, output)
            return 'quit';
        }

        /*
        Regardless of what content has become, it is added to the main interpreter's output.
        May want to add an error case if content was not given a value because none of the conditional statements executed.
        */
        output.push(content)
    }
}

function evaluateExpression(value, registers, output) {

    // Extracting variable values if there are any
    /*
    The following line replaces any variables in the expressions with their values and saves it in the expression variable.
    Once again this does not seem to check for the case where an unitialized variable is used.
    Perhaps we ought to include that detection in the decode method.
    */

    let expression = []

    for (let i = 0; i < value.length; i++) {
        if (['+', '-', '*', '/', '='].includes(value[i])) {
            expression.push(value[i])
        }
        else {

            let res = substituteVariable(registers, value[i])
            if (res == null) {

                undeclaredVariableMessage(value[i], output)
                return null
            }
            expression.push(res)
        }
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
    That's probably it.
    */
    return expression.join()

} 

function performMathOp(registers, var1, var2, operation) {
    // Next 2 lines checks which code entries are integers vs a preexisting register value (variable)
    /*
    I'm not even sure if the above comment is right but I doubt it.
    Instead, if var1 or var2 is numeric, then val1 or val2 should just be set to that number.
    Otherwise, val1 or val2 should be set to the value of the variable with var1 or var2's name.
    In general, keen awareness should be maintained of what this program is currently capable of.
    */
    let val1 = substituteVariable(registers, var1) 
    let val2 = substituteVariable(registers, var2)
    if (val2 === null) {
        return null;
    }  
    return Math.round(operation(val1, val2))
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
        undeclaredVariableMessage(line[0], output)
        return 'quit';
    }

    //The variable is incremented within registers, as is appropriate.
    registers[line[0]] = operation(registers[line[0]], 1)
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
        undeclaredVariableMessage(line[1], output)
        return 'quit'
    }

    line[1] = res

    //The addition is performed here.

    if (!Object.prototype.hasOwnProperty.call(registers, line[0])) {
        undeclaredVariableMessage(line[0], output)
        return 'quit'
    }

    registers[line[0]] = operation(registers[line[0]], line[1]) // Incrementing conditional value
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
    let register = substituteVariable(registers, line[0])

    if (register === null) {
        undeclaredVariableMessage(line[0], output)
        return null;
    }

    //operator is set to the second word, which indeed should be an operator.
    let operator = line[1]  // Should be a comparison operator
    //The same operation is done to assign comparator as was done to assign register, except it is done on the third word this time.
    let comparator = substituteVariable(registers, line[2])

    if (comparator === null) {
        undeclaredVariableMessage(line[2], output)
        return null;
    }
    
    /*
    Different calculations are done depending on what the operator is.
    I realize now that names for register and comparator are a bit misleading, they are really just operands.
    If the default case is hit, which it should not be, a message is displayed to the console.
    break statements may not be needed after each case, but perhaps they should be added to be safe.
    */
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
            console.log("default branch case on operator: " + operator)
            break;

    }
    
}
