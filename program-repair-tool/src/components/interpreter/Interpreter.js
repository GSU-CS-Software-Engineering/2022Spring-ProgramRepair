import * as mips from './mips_instructions.js'


export class Interpreter {
                
    constructor(blocks_list, registers) {
        this.registers = typeof(registers) != "undefined"? registers : {}  // Variables that are stored and/or manipulated
        // List of code instruction blocks. Separated by line number
        // Keeps track of code to run for different scopes throughout
        // the user's program
        this.blocks_list = typeof(blocks_list) == 'object'? blocks_list.innerHTML : blocks_list 
        this.instructions = []
        this.output = []
    }

    run() {
        if (typeof this.blocks_list !== 'undefined') {
            this.fetch()
            this.decode()
            // execute is called automatically from decode
        }
        else {
            console.log("Undefined blocks_list")
        }
        
    }
    fetch() { // Pull instruction from instruction components
        this.blocks_list = this.blocks_list
            .split("\n")            // Each code instruction needs to be on it's own line
            .map(x => x.trim())     // Trim white space from each line
            .filter(x => {
                return x.length > 0 // Make sure empty strings aren't added to list
            })
        
    }
    decode() {  // Instruction should be a component with attributes that represent registers
                // and extract the values from them as well as the function being performed
                // Load values into registers

        // Split each code line up into keywords and values by white space
        var kw_vals = this.blocks_list.map( x => {
            if (x.includes("System.out")) { // Marking stdout with a keyword for the decoder to read
                return ["print", x]
            }
            var arr = x.split(/\s/)
            return arr
        })

        for (let i = 0; i < kw_vals.length; i++) {        // Go through each line given in the problem
            var keyword=kw_vals[i][0]   // Keyword = first word on a line
            let line = kw_vals[i]
            var instruction = {} 

            // Trying to check if register has a variable already exists and execute accordingly
            // This should also prevent variable initialization errors.
            if (Object.prototype.hasOwnProperty.call(this.registers, keyword)) { 
                keyword = "variable"
            }

            // Have to declare these outside of switch: for/if
            let new_blocks_list;
            let conditions;
            let block_start;
            let block_end;
            var scope_stack;
            let block_len;

            switch (keyword) {
            
                case "int":     //  LOAD WORD: Copy from memory to register
                 
                    // For declaring a variable e.g. (int a;)
                    if (line.length == 2 && !isNumeric(line[1])) {
                        line[1] = line[1].indexOf(";") > 0 ? line[1].slice(0,-1) : line[1]


                            instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[1],  // variable name being stored to register
                            value: line[1].indexOf(";") > 0 ? line[1].slice(0,-1) : line[1]    // value being stored to register
                    
                        }
                    }
                    // For initializing a variable e.g. (int a = 5;)
                    else if (line.length == 4) {
                        var val = line[line.indexOf("=") + 1]
                        var value = val.indexOf(";") > 0 ? val.slice(0,-1) : val
                        instruction = {
                            func: "lw",       // func should represent the function given in the instruction
                            var1: line[(line.indexOf("=")-1)],  // variable name being stored to register
                            value: (Object.prototype.hasOwnProperty.call(this.registers, value)) ? this.registers[value] : value          // value being stored to register
                        
                        }
                        
                    }
                    // For initializing a variable with the output of an expression e.g. (int a = 2 + 3; int a = b + c..)
                    else if (line.length > 4) {
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
                case "variable": // (c = a + b +....(+-*/))
                    var indexOfOperator = 0
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
                    else if (line.indexOf("+=") > 0 && line.length == 3) {  // Only works if line length == 3; ( num += 2 ) and ( num += num )
                        instruction = {
                            func: "addi",
                            reg_val: line[0],
                            var1: line[0],
                            var2: line[2].indexOf(";") > 0 ? line[2].slice(0,-1) : line[2]
                        }
                    }   
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
                    else if (line.indexOf("*") > 0) {
                        indexOfOperator = line.indexOf("*")
                        instruction = {
                            func: "mult",
                            reg_val: line[0],
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator+1]       // operand 2
                        }
                    }
                    else if (line.indexOf("/") > 0) {
                        indexOfOperator = line.indexOf("/")
                        instruction = {
                            func: "div",
                            reg_val: line[0], 
                            var1: line[indexOfOperator-1],  // operand 1
                            var2: line[indexOfOperator+1].indexOf(";") ? line[indexOfOperator+1].slice(0,-1) : line[indexOfOperator+1]       // operand 2
                        }
                    }                  
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
                    else  {
                        console.log("Error: " + line)
                    }
                    break;
                case "for":
                    line = line.join(' ')
                    // Getting everything between the parentheses
                    conditions = line.split("(")[1].split(")")[0].split(";")
                    // Beginning and end of lines being executed by the for loop

                    block_start = 0;
                    block_end = 0;
                    scope_stack = [];
                    new_blocks_list = [];
                    // Support for nested loops
                    for (let j in kw_vals) {
                        if (kw_vals[j].includes("for") && scope_stack.length == 0) {
                            scope_stack.push("{")
                            block_start = parseInt(j)
                            continue
                        }
                        else if(scope_stack.length > 0) {
                            for (let k in  line) {
                                if (kw_vals[j][k] == "}") {
                                    scope_stack.pop()
                                    if (scope_stack.length == 0) {
                                        block_end = parseInt(j)
                                        break;
                                    }
                                }
                                else if (kw_vals[j][k] == "{"){
                                    scope_stack.push("{")
                                }
                            }
                        }
                        if (block_end > 0) {
                            break;
                        }
                    }
                    if (scope_stack.length > 0 || block_end < 1) {
                        console.log("ERROR -> decode -> for -> scope stack")

                    }

                    // Removes for loop instructions from being added to the main instruction list
                    block_len = block_end - block_start
                    new_blocks_list = this.blocks_list.splice(block_start, block_len + 1)
                    kw_vals.splice(block_start, block_len + 1)   

                    // Need to stay on the same index for the next iteration
                    i--; 
                    new_blocks_list.shift(); new_blocks_list.pop();
                    
                    instruction = {
                        func: "for",
                        blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                        conditions: conditions
                    }
                    break;

                case "if":  // Decoding if statements
                    
                    line = line.join(' ')
                    // Getting everything between the parentheses
                    conditions = line.split("(")[1].split(")")[0]

                    // Beginning and end of lines being executed by the for loop
                    block_start = 0
                    block_end = 0
                    scope_stack = [];
                    new_blocks_list = [];

                    for (let j in kw_vals) {
                        if (kw_vals[j].includes("if") && scope_stack.length == 0) {
                            scope_stack.push("{")
                            block_start = parseInt(j)
                            continue
                        }
                        else if(scope_stack.length > 0) {
                            for (let k in line) {
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
                            break;
                        }
                    }
                    if (scope_stack.length > 0 || block_end < 1) {
                        console.log("ERROR -> decode -> if -> scope stack")

                    }

                    // Removes if instructions from being added to the main instruction list
                    block_len = block_end - block_start
                    new_blocks_list = this.blocks_list.splice(block_start, block_len + 1)
                    kw_vals.splice(block_start, block_len + 1)
                    
                    // Getting rid of if statement and the closing bracket
                    new_blocks_list.shift(); new_blocks_list.pop();
                        
                    instruction = {
                        func: "if",
                        blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                        conditions: conditions
                    }
                    // Storing (else if())'s following a standard if statement
                    let else_container = []
                    let placeHolder = i

                    while (typeof(kw_vals[placeHolder]) !== 'undefined' && kw_vals[placeHolder].indexOf("else") == 0) {
                        // Else-if
                        if (kw_vals[i][1] != "{") {
                            let line = kw_vals[i].join(' ')
                            conditions = line.split("(")[1].split(")")[0]
                            let scope = get_stack_scope(kw_vals, "else")
                            new_blocks_list = this.blocks_list.splice(scope.start, scope.len + 1)
                            kw_vals.splice(scope.start, scope.len + 1)
                            new_blocks_list.shift(); new_blocks_list.pop();
                            let else_if_instruction = {
                                func: "if",
                                blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                                conditions: conditions
                            }
                            else_container.push(else_if_instruction)
                            instruction["else-if"] = else_container
                            
                        }
                        // Else
                        else {
                            let scope = get_stack_scope(kw_vals, "else")
                            new_blocks_list = this.blocks_list.splice(scope.start, scope.len + 1)
                            kw_vals.splice(scope.start, scope.len + 1)
                            new_blocks_list.shift(); new_blocks_list.pop();
                            let else_instruction = {
                                func: "else",
                                blocks_list: new_blocks_list.length > 1 ? new_blocks_list.join("\n") : new_blocks_list[0],
                            }
                            else_container.push(else_instruction)
                            instruction["else-if"] = else_container
                            break;
                        }

                        if (typeof(kw_vals[placeHolder]) != "object" || placeHolder > kw_vals.length) break;
                        
                    }

                     // Need to stay on the same index for the next iteration
                    i--;
                    break;
                case "print":
                    
                    var print_container = line[1].split("(")[1].split(")")[0]
                    instruction = {
                        func: "print",       // func should represent the function given in the instruction
                        value: print_container
                    }
                    break
                default:
                    console.log("Couldn't read a keyword")
                    break;
                }
            this.instructions.push(instruction) // Keeping log of instructions - not needed honestly
            this.execute(instruction)
        }
    }

    // Instructions execute after each instruction is decoded, so it reads and executes code from top to bottom.
    execute(instruction) {
        let key = instruction
        if (key.func == "lw") {         // Loading value to registers
            if (isNumeric(key.value)) {
                this.registers[key.var1] = key.value
            }
            

            // Assigning an expression to a variable
            else if (key.value.length > 2) {

                // Extracting variable values if there are any
                let expression = key.value.map(x => Object.prototype.hasOwnProperty.call(this.registers, x) ? this.registers[x] : x);
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
                this.registers[key.var1] = expression.join()
            } 
 
        }
        else if (key.func == "add") {   // Used for adding VARIABLES ONLY 
            let register_name = key.reg_val
            let val1 = this.registers[key.var1]
            let val2 = this.registers[key.var2]
            let new_val = Math.round(mips.add(val1, val2))
            this.registers[register_name] = new_val
        }
        else if (key.func == "addi") {  // Flexible addition for both integer vals and variable vals
            let register_name = key.reg_val
            // Next 2 lines checks which code entries are integers vs a preexisting register value (variable)
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]  
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.add(val1, val2))
            this.registers[register_name] = new_val
        }
        else if (key.func == "sub") {   // Used for subtracting VARIABLES ONLY
            let register_name = key.reg_val
            let val1 = this.registers[key.var1]
            let val2 = this.registers[key.var2] 
            let new_val = Math.round(mips.sub(val1, val2))             
            this.registers[register_name] = new_val
        }
        else if (key.func == "subi") {  // Flexible subtraction for both integer vals and variable vals
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.sub(val1, val2))                
            this.registers[register_name] = new_val
        }
        else if (key.func == "mult") {  // Flexible multiplication
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2] 
            let new_val = Math.round(mips.mult(val1, val2))           
            this.registers[register_name] = new_val
        }
        else if (key.func == "div") {   // Flexible divison
            let register_name = key.reg_val
            let val1 = !isNumeric(this.registers[key.var1]) ? key.var1 : this.registers[key.var1]
            let val2 = !isNumeric(this.registers[key.var2]) ? key.var2 : this.registers[key.var2]
            let new_val = Math.round(mips.div(val1, val2))               
            this.registers[register_name] = new_val
        }
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
