<!--
Uncertainties currently reside on lines 27, 29, 86, 108, and 117.
-->
<!--
Below is the template for this component.
-->

<template>
    <!--
    The div that contains all of this component's template has the class drag-input, I am not sure where this is defined right now, if it's defined anywhere.
    -->
    <div class="drag-input" :output="output">
        <!--
        The problem's prompt is displayed in this header.
        -->
        <h3 class="header">Prompt: {{ problem.prompt }}</h3>
        <!--
        This div holds the part of the screen where code blocks can be dragged around.
        -->
        <div class="container">
            <!--
            The following draggable tag is a component that was imported below.
            v-model="problem.code" will make it so that the code field of the problem attribute of the draggable component will match the code field of the problem attribute of this component, which is declared below.
            The code transition="100" does not seem to do anything, I am not sure what the intention was, but maybe we'll put time into making the interface more animated.
            The draggable component has class drop-zone, which is defined in the style section.
            There is an inner template which I assume is used to represent the content inside the draggable area.
            The code v-slot:item="{ item }" specifies that this slot, which is contained in this template, will have an attribute named item with the value of an attribute named item from the parent, though I am uncertain about where exactly this is coming from.
            For more information on v-slot check: https://vuejs.org/guide/components/slots.html
            There is a div with a draggable-item class, which is defined in the style below, and within the div the item's title is displayed. Still uncertain on item's origin.
            -->
            <draggable
                v-model="problem.code"
                transition="100"
                class="drop-zone">
                <template v-slot:item="{ item }">
                    <div class="draggable-item">
                    {{ item.title }}
                    </div>
                </template>
            </draggable>
        </div>
        <!--
        Below are two buttons, when the run button is clicked the run method will run, and when the clear console button is clicked the clearConsole method will run.
        -->
        <div>
            <button class="button" @click="run">Run</button>
            <button class="button" @click="clearConsole">Clear Console</button>
        </div>
    </div>
</template>
<script>
import Draggable from 'vue3-draggable'
/*
Unsure why an asterisk was needed to import from Interpreter.js, importing semantics can be looked up if needed.
*/
import * as Interpreter from "./interpreter/Interpreter.js"

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
            output: String
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
            //For each element in the problem's code, its title followed by a new line is appended to the blocks_list variable.
            //Still uncertain about why the name title is used, or where exactly the code attribute is defined.
            this.$props.problem.code.forEach(x => {
                blocks_list += `${x.title}\n`
            })
            let undefined;  // constructor requires two arguments and has checks for undefined
            //An instance of the interpreter is created and run with the code.
            //The semantics of how it is created can be checked when we look at the interpreter code.
            let i = new Interpreter.Interpreter(blocks_list, undefined)
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
            The code is likely intended to pause execution until the event has been recieved by the listener and acted upon.
            For the moment I am uncertain as to if that is what this statement is actually doing, or if the await keyword is even necessary.
            */
            await this.$emit("updateOutput", output_array)
            /*
            cur_problem is either a JavaScript object parsed from JSON retrieved from the client's machine or an object with an answer of "Hello World" if no item called cur-problem is found.
            */
            let cur_problem=JSON.parse(window.localStorage.getItem('cur-problem')) || {answer: "Hello World"};
            /*
            If the problem's answer matches the output array, the code is marked as correct.
            Uncertain why this works when output_array is not a String like apparently intended, will need too look at where a problem and its attributes are defined.
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
    }
};
</script>

<!--
Once again, the scoped boolean is deprecated and should not be used.
Some styling is done on buttons, and several CSS classes are defined and they are used in the above code.
-->

<style scoped>
    button {
        padding: 10px 20px;
        margin-right: 5px;
    }
    .container {
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
        padding-left: 10px;
        text-align: left;
        
    }
</style>