//This is where the problems will be stored in our new application, on the backend.
import {availableProblems} from "@supabase/supabase-js";
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
        ];
        Array.prototype.push.apply(this.problemList,availableProblems);
        console.log("push to Supabase");
    }

    //This method returns to problemList for a caller to make use of.

    getProblems() {
        return this.problemList;
    }
   
}

module.exports = Problems;