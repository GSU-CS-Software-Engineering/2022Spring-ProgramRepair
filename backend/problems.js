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
        ];
    }

    //This method returns to problemList for a caller to make use of.

    getProblems() {
        return this.problemList;
    }
}

module.exports = Problems;