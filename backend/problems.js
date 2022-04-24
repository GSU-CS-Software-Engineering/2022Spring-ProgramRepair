//This is where the problems will be stored in our new application, on the backend.
class Problems {
    //Once this class is constructed an array called blocks and the problemList will be created, with some filler entries for now whose format will change.
    constructor() {
        this.initialize();
    }

    initialize() {

        //This array contains all available code blocks, and will be referenced within the problemList.

        this.blocks = [
            "System.out.println(i);",
            "for (int i = 0; i < 4; i++) {",
            "}",
            "if (i > 4) {",
            "else if (i > 0) {",
            "else {",
        ];
        /*
        The blocks attribute of a problem is an array of objects.
        Each object has a block, which is referenced from the blocks array, and a quantity, which is problem-specific.
        Unlimited quantity could be represented in a number of ways, such as with a quantity of 0, but this has not been decided upon yet.
        Right now problems still posess a code attribute to ease testing, but this will eventually be removes, as the blocks attribute will be used to populate the inventory section of the solving page.
        */
        this.problemList =
        [
            /*
           { name: 'Say Hello', prompt: 'Please print "Hello World" to the console.', code: ['System.out.println("Hello World");'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello World' },
           { name: 'Count to Three', prompt: 'Please print the numbers 1-3 line-by-line using a for loop.', code: ['for (int i = 1; i <= 3; i++) {', 'System.out.println(i);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }, { block: this.blocks[1], quantity: 1 }, { block: this.blocks[2], quantity: 1 }], answer: '1,2,3'},
           { name: 'Say Goodbye', prompt: 'Please print "Goodbye World" to the console.', code: ['System.out.println("Goodbye World");'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Goodbye World' },
           { name: 'If Statement 1', prompt: 'Complete the if statement, please.', code: ['int i = 4;', 'if (i < 4) {', 'System.out.println("Less than four!");', '}', 'else if (i == 4) {', 'System.out.println("Equal to four!");', '}', 'else {', 'System.out.println("Greater than four!");', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Equal to four!' },
           { name: 'If Statement 2', prompt: 'Complete the if statement, please.', code: ['int i = 3;', 'if (i < 4) {', 'System.out.println("Less than four!");', '}', 'else if (i == 4) {', 'System.out.println("Equal to four!");', '}', 'else {', 'System.out.println("Greater than four!");', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Less than four!' },
           { name: 'If Statement 3', prompt: 'Complete the if statement, please.', code: ['int i = 5;', 'if (i < 4) {', 'System.out.println("Less than four!");', '}', 'else if (i == 4) {', 'System.out.println("Equal to four!");', '}', 'else {', 'System.out.println("Greater than four!");', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Greater than four!' },
           { name: 'Expression test 1', prompt: 'Testing mathematical expression.', code: ['int a = 5 + 9 * 10;', 'System.out.println(a);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '95' },
           { name: 'Expression test 2', prompt: 'Testing printing a mathematical expression.', code: ['System.out.println(5 + 9 * 10);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '95' },
           { name: 'Simple math test.', prompt: 'Testing simple math operations.', code: ['int i = 15;', 'i /= 5;', 'System.out.println(i);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '3' },
           { name: 'Nested If Statement 1', prompt: 'Testing nested if statement.', code: ['int i = 5;', 'if (i <= 5) {', 'if (i == 5) {', 'System.out.println("Equals five!");', '}', 'else {', 'System.out.println("Less than five!");', '}', '}', 'else {', 'System.out.println("Greater than five!);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Equals five!' },
           { name: 'Nested If Statement 2', prompt: 'Testing nested if statement.', code: ['int i = 4;', 'if (i <= 5) {', 'if (i == 5) {', 'System.out.println("Equals five!");', '}', 'else if (i == 4) {', 'System.out.println("Equals four!");', '}', 'else {', 'System.out.println("Less than four!");', '}', '}', 'else {', 'System.out.println("Greater than five!);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Equals four!' },
           { name: 'Nested If Statement 3', prompt: 'Testing nested if statement.', code: ['int i = 6;', 'if (i <= 5) {', 'if (i == 5) {', 'System.out.println("Equals five!");', '}', 'else {', 'System.out.println("Less than five!");', '}', '}', 'else {', 'System.out.println("Greater than five!);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Greater than five!' },
           { name: 'Nested For Loop', prompt: 'Testing nested for loop.', code: ['for (int i = 1; i <= 3; i++) {', 'for (int j = 3; j > 0; j--) {', 'System.out.println(i);', 'System.out.println(j);', '}', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '1,3,1,2,1,1,2,3,2,2,2,1,3,3,3,2,3,1' },
           { name: 'Undeclared Variable', prompt: 'Testing an undeclared variable.', code: ['int a;', 'a = 3 + 4;', 'System.out.println(a);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '7' },
           { name: 'Undeclared Variable In Expressions', prompt: 'Testing an undeclared variable.', code: ['System.out.print("Test!");', 'int a = 4;', 'int b = a;', 'System.out.println(a + b);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Test!,8' },
           { name: 'Undeclared Variable For', prompt: 'Testing an undeclared variable.', code: ['int a = 4;', 'int b = 3;', 'int c = 1;','for (int x = a; b > 0; c++) {', 'System.out.println(b);', 'b -= 1;', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '3,2,1' },
           { name: 'Undeclared Variable Nested For', prompt: 'Testing an undeclared variable.', code: ['int z = 1;', 'for (int i = 1; i <= 3; i++) {', 'for (int j = 3; j > 0; j--) {', 'System.out.println(i);', 'System.out.println(j);', 'z += 1', '}', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '1,3,1,2,1,1,2,3,2,2,2,1,3,3,3,2,3,1' },
           { name: 'Divide by zero', prompt: 'Testing dividing by zero.', code: ['int a = 5 + 9 / 0;', 'System.out.println(a);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '95' },
           { name: 'Duplicate Declaration Test', prompt: 'Testing duplicate declaration.', code: ['int a = 5;', 'for (int a = 0; a < 4; a++) {', 'System.out.println(a);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '0,1,2,3' },
           { name: 'Missing bracket test', prompt: 'Testing missing bracket.', code: ['for (int a = 0; a < 4; a++) {', 'System.out.println(a);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '0,1,2,3' },
           { name: 'Testing Final', prompt: 'Testing a constant integer.', code: ['final int a = 4;', 'final int b = a - 2;', 'System.out.println(b);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '2' },
           { name: 'Testing Divison', prompt: 'Testing integer vs. double divison.', code: ['double x = 2;', 'int y = 3;', 'System.out.println(x * y / 4);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '1.5' },
           { name: 'Testing Booleans 1', prompt: 'Testing boolean functionality.', code: ['boolean x = 4 + 3 > 6', 'System.out.println(!!x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'true' },
           { name: 'Testing String Saving', prompt: 'Testing String functionality.', code: ['String s = "Hello there!"', 'System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello there!' },
           { name: 'Testing Incorrect String Assignment', prompt: 'Testing String functionality in case of an error.', code: ['String s = 4', 'System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '4' },
           { name: 'Testing String Expressions 1', prompt: 'Testing simple String expressions.', code: ['String s = "H"', 'System.out.println(s += "ello" + " World");', 'System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello World,Hello' },
           { name: 'Testing String Expressions 2', prompt: 'Testing simple String expressions with an error.', code: ['String s = "H"', 'System.out.println(s += "ello + " World");', 'System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello World,Hello' },
           { name: 'Testing String Expressions 3', prompt: 'Testing complex String expressions.', code: ['String s = "H"', 's += !true', 's += 9','System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hfalse9' }
            */

           { name: 'Initialize Integer', prompt: 'Displays an integer saved to a variable to ensure correct functioning.', code: ['int x = 4;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '4' },
           { name: 'Initialize Double', prompt: 'Displays a double saved to a variable to ensure correct functioning.', code: ['double pi = 3.14;', 'System.out.println(pi);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '3.14' },
           { name: 'Initialize Boolean', prompt: 'Displays a boolean saved to a variable to ensure correct functioning.', code: ['boolean x = true;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'true' },
           { name: 'Initialize String', prompt: 'Displays a string saved to a variable to ensure correct functioning.', code: ['String x = "Hello world!";', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello world!' },
           { name: 'Alter Integer', prompt: 'Tests the successful alteration of an integer.', code: ['int x = 4;', 'x = 9;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '9' },
           { name: 'Alter Double', prompt: 'Tests the successful alteration of a double.', code: ['double x = 6.4;', 'x = 3.7;','System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '3.7' },
           { name: 'Alter Boolean', prompt: 'Tests the successful alteration of a boolean.', code: ['boolean x = true;', 'x = false;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'false' },
           { name: 'Alter String', prompt: 'Tests the successful alteration of a string.', code: ['String x = "Hello world!";', 'x = "Goodbye world!";', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Goodbye world!' },
           { name: 'Declare then Initialize Integer', prompt: 'Declares an integer and then initializes it, then prints the value to ensure proper functioning.', code: ['int x;', 'x = -4;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '-4' },
           { name: 'Declare then Initialize Double', prompt: 'Declares a double and then initializes it, then prints the value to ensure proper functioning.', code: ['double x;', 'x = 0.00;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '0.00' },
           { name: 'Declare then Initialize Boolean', prompt: 'Declares a boolean and then initializes it, then prints the value to ensure proper functioning.', code: ['boolean x;', 'x = true;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'true' },
           { name: 'Declare then Initialize String', prompt: 'Declares a string and then initializes it, then prints the value to ensure proper functioning.', code: ['String x;', 'x = "Hello world!";', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello world!' },
           { name: 'Test Uninitialized Variable', prompt: 'Attempts to use a variable that has not been initialized.', code: ['int y = -4;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '-4' },
           { name: 'Test Duplicate Variable', prompt: 'Attempts to intitialize the same variable twice.', code: ['double x;', 'x = 0.00;', 'double x = 4.1;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '4.1' },
           { name: 'Test Out of Scope Variable', prompt: 'Attempts to print a variable that is not within the scope of the print statement.', code: ['int x = 4;', 'if (x > 2) {', 'int y = 3;', '}', 'System.out.println(y);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '3' },
           { name: 'Test Type Mismatch', prompt: 'Attempts to save a double as an integer.', code: ['int x = 4.14;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '4.14' },
           { name: 'Test Altered Constant', prompt: 'Attempts to alter the value of a constant.', code: ['final int x = 4;', 'x = -4;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '-4' },
           { name: 'Test Divide By Zero', prompt: 'Attempts to divide by zero.', code: ['double x = 4 / 0;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '0' },
           { name: 'Evaluate Math Expression', prompt: 'Tests the evaluation of a math expression.', code: ['int x = 45 / 5 + 10;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '19' },
           { name: 'Evaluate Boolean Expression', prompt: 'Tests the evaluation of a boolean expression.', code: ['boolean x = 4 > 2 && 6 < 5;', 'System.out.println(x);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'false' },
           { name: 'Evaluate String Expression', prompt: 'Tests the evaluation of a string expression.', code: ['String s = "H";', 'System.out.println(s += "ello" + " World!");', 'System.out.println(s);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Hello World!,Hello World!' },
           { name: 'Nested If Statements', prompt: 'Tests the handling of nested if statements.', code: ['int i = 5;', 'if (i <= 5) {', 'if (i == 5) {', 'System.out.println("Equals five!");', '}', 'else {', 'System.out.println("Less than five!");', '}', '}', 'else {', 'System.out.println("Greater than five!);', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'Equals five!' },
           { name: 'Nested For Loops', prompt: 'Tests the handling of nested for loops.', code: ['for (int i = 1; i <= 3; i++) {', 'for (int j = 3; j > 0; j--) {', 'System.out.println(i);', 'System.out.println(j);', '}', '}'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: '1,3,1,2,1,1,2,3,2,2,2,1,3,3,3,2,3,1' },
           { name: 'Evaluate String Expression 2', prompt: 'Tests the evaluation of a string expression.', code: ['String x = "x";', 'String y = "y";', 'String z = "z";', 'System.out.println(x += y += z);', 'System.out.println(x);', 'System.out.println(y);', 'System.out.println(z);'], blocks: [{ block: this.blocks[0], quantity: 1 }], answer: 'xyz,xyz,yz,z' },
           

        ];
    }

    //This method returns to problemList for a caller to make use of.

    getProblems() {
        return this.problemList;
    }
}

module.exports = Problems;