//This is where the problems will be stored in our new application, on the backend.
class Problems {
    //Once this class is constructed the problemList will be created, with some filler entries for now whose format will change.
    constructor() {
        this.initialize();
    }

    initialize() {
        this.problemList =
        [
           { name: 'Say Hello', prompt: 'Please print "Hello World" to the console.', code: 'System.out.println("Hello World");', answer: 'Hello World' },
           { name: 'Count to Three', prompt: 'Please print the numbers 1-3 line-by-line using a for loop.', code: '["for (int i = 1; i <= 3; i++) {", "System.out.println(i);", "}"]', answer: '1,2,3'},
           { name: 'Say Goodbye', prompt: 'Please print "Goodbye World" to the console.', code: 'System.out.println("Goodbye World");', answer: 'Goodbye World' },
        ];
    }

    //This problems sens the problemList to any caller.

    getProblems() {
        return this.problemList;
    }
}

module.exports = Problems;