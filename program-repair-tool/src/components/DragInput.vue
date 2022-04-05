<!--
Below is the template for this component.
-->
<template>
    <!--
    The div that contains all of this component's template has the class drag-input, I am not sure where this is defined right now, if it's defined anywhere.
    -->
    <div class="drag-input" :output="output">
        <h3 class="header">Workspace:</h3>
        <!--
        This div holds the part of the screen where code blocks can be dragged around.
        -->
        <div class="workspace-container">
            <!--
            The following draggable tag is a component that was imported below.
            v-model="problem.code" will make it so that the code field of the problem attribute of the draggable component will match the code field of the problem attribute of this component, which is declared below.
            The code transition="100" does not seem to do anything, I am not sure what the intention was, but maybe we'll put time into making the interface more animated.
            The draggable component has class drop-zone, which is defined in the style section.
            There is an inner template which I assume is used to represent the content inside the draggable area.
            The code v-slot:item="{ item }" specifies that this slot, which is contained in this template, will have an attribute named item with the value of an attribute named item from the parent, and this originates from Main.vue.
            For more information on v-slot check: https://vuejs.org/guide/components/slots.html
            There is a div with a draggable-item class, which is defined in the style below, and within the div the item is displayed.
            In effect this creates the blocks for each element inside the code array.
           unexpected mutatation of problem prop line 33
            -->
            <draggable v-model="problem.code" transition="100" class="drop-zone">
                <template v-slot:item="{ item }">
                    <div class="draggable-item">
                        {{ item }}
                    </div>
                </template>
            </draggable>
        </div>
        <!--
        Below are two buttons, when the run button is clicked the run method will run, and when the clear console button is clicked the clearConsole method will run.
        -->
        <div>
            <button class="button" @click="returnHome">Home</button>
            <button class="button" @click="clearWorkspace">Clear</button>
            <button class="button" @click="clearConsole">Clear Console</button>
            <button class="button" @click="run">Run</button>

        </div>
    </div>
</template>

<script>
import Draggable from 'vue3-draggable'
/*
Unsure why an asterisk was needed to import from Interpreter.js, importing semantics can be looked up if needed.
n: it seems that the asterisk imports everything from the file instead of designated portions. This is a wildcard import. Not recommended generally but still used.https://rules.sonarsource.com/javascript/RSPEC-2208
*/
import Interpreter from "./interpreter/Interpreter.js"

export default {
    //Draggable is registered as a component, which allows it to be used in the template above.
    components: {
        Draggable
    },
    //This component has a prop called problem, which is an Object.
    //It is a prop as opposed to data so that a value can be passed in from a higher level component that uses this one, and this is shown in Main.vue line 21.
    props: {
        problem: Object
    },
    //This component has one data attribute named output which is a String.
    data() {
        return {
            output: String,
        };
    },
    methods: {
        /*
        This is the run method.
        It is aynchronous, so while statements will be executed in sequence, the function will not wait for a statement to finish executing before proceeding to the next one.
        */
        async run() {
            //Unsure of why the console is cleared, may want to change that.
            console.clear()
            // Converting drag/drop components to strings, then running through interpreter
            //A variable is created in order to store the string representation of the code the user has put together.
            var blocks_list = ''
            //For each element in the problem's code, its content followed by a new line is appended to the blocks_list variable.
            this.$props.problem.code.forEach(x => {
                blocks_list += `${x}\n`
            })
            let undefined;  // constructor requires two arguments and has checks for undefined
            //An instance of the interpreter is created and run with the code.
            //The semantics of how it is created can be checked when we look at the interpreter code.
            let i = new Interpreter(blocks_list, undefined)
            i.run()
            
            // Submitting output for rendering to STDOUT
            //The output from the interpreter is obtained.
            let output_array = i.get_output();
            /*
            The join method returns the array's contents separated by a certain character, in this case, a ",".
            This makes the following statement dubious since the returned value is never stored anwyehre, and output_array itself is unchanged.
            */
            output_array.join(",")
            /*
            The following statement fires an updateOutput event with value output_array.
            The await keyword pauses the asynchronous function until a promise is fulfilled or rejected.
            The code is to pause execution until the event has been recieved by the listener and acted upon.
            */
            await this.$emit("updateOutput", output_array)
            /*
            cur_problem is either a JavaScript object parsed from JSON retrieved from the client's machine or an object with an answer of "Hello World" if no item called cur-problem is found.
            */
            let cur_problem=JSON.parse(window.localStorage.getItem('cur-problem')) || {answer: "Hello World"};

            console.log(cur_problem.answer)
            /*
            If the problem's answer matches the output array, the code is marked as correct.
            */
            if(cur_problem.answer == output_array) {
                console.log("VALID")
                alert("Congratulations! You're correct!")
            }
            //If the problem's answer does not match the output array, the code is marked as incorrect.
            else {
                alert("Try Again. You can do this!")
            }
        },

        //This function fires a clearConsole event with no data.
        clearConsole() {
            this.$emit("clearConsole")
        },
        returnHome() { //Alert message when user uses 'Home' button & there is an item in the workspace
            if (this.$props.problem.code.length == 0) {
                if (window.confirm("Are you sure you want to return home?\nProgress may be lost")) {
                    window.location.replace('http://localhost:8080');
                }
            } else {
                window.location.replace('http://localhost:8080');
            }
        },

        

        //This function shuffles an input array
        shuffle(array) {
            this.$parent.shuffle(array);
        },
        //This function calles the parent function: reload()
        reload() {
            this.$parent.reload();
        },
        //This function (attemps to) clears the workspace 
        clearWorkspace() {
            // If the inventory size is 0, copy all the data from the workspace.
            if (window.confirm("Are you sure you want to clear workspace?")){ //To make sure the user doesn't accidentally clear their work
                if (this.$props.problem.code.length == 0) {
                    console.log("Inventory is empty, shuffling new one.");
                    this.$props.problem.code = this.$data.items;
                    this.$data.items = [];
                // Otherwise, move the remaining blocks back to the inventory.
                } else {
                    console.log("Moving all codeblocks back to the inventory.");
                    this.$props.problem.code = this.shuffle(this.$props.problem.code.concat(this.$data.items));
                }
            }
            this.reload();
        }
    },
};

/* (WIP) To ensure user doesn't close Tab or Window (Impacts all changes within the website, fixable by using window.onbeforeunload = null but unsure if needed)
    window.onbeforeunload = function (e) {
        e = e || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
         e.returnValue = 'Any string';
        }

        // For Safari
        return 'Any string';
    };
*/
</script>

<!--
Some styling is done on buttons, and several CSS classes are defined and they are used in the above code.
-->

<style scoped>
    button {
        padding: 10px 20px;
        margin-right: 5px;
    }
    .workspace-container {
    width: 500px;
    display: flex;
    flex-direction: row;
    }
    .draggable-item {
    display: flex;
    justify-content: center;
    background-color: lightblue;
    box-shadow: 0px 2px 5px #aaa;
    margin: 1%;
    padding: 1%;
    }
    .drop-zone {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 3px 5px #aaa;
    margin: 30px;
    padding: 10px;
    width: 400px;
    min-height: 200px;
    height: auto !important;
    }
    .header {
        padding-inline: 20px;
        padding-left: 30px;
        text-align: left;
        
    }
</style>