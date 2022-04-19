<!--
There are some aspects of this file that require further investigation.
Right now these are detailed on lines 90, 101, and 103.
-->

<!--
This is the template for the main component.
This component is shown when the user goes to the page for solving a specific problem.
The template has a div that holds all of the HTML content.
-->

<template>

    <div>
        <!--
            The div below displays the current problem's name and prompt, and Bulma CSS classes are used for styling.
            This div is followed by an hr tag, which stands for horizontal rule, which shows up as a horizontal line across the screen.
        -->
        <div>
        <h1 class="title has-text-left p-2">{{ problem.name }}</h1>
        <h2 class="subtitle has-text-left p-2">{{ problem.prompt }}</h2>
        </div>
        <hr />
        <!--
            The paragraph below displays general instructions to the user, and it also uses some Bulma CSS classes.
            In the future we may want to make this a tooltip for aesthetic purposes, but that is low priority.
        -->
        <p class="has-text-left p-2">
            General Instructions:
            <br />
            Drag the available blocks from the inventory section into the workspace section to construct your code.
            <br />
            Blocks can be dragged around within the workspace section or outside of it to place them back into the inventory section.
            <br />
            When you are done constructing your solution, click the Run button to check your answer.
             <br />
            The Clear button will remove all blocks from your workspace, and the Clear Console button will empty the output in the console.
        </p>
        <hr />
        <!--
            Similar to what is done in Problems.vue, a div holding the different sections is set to contain Bulma CSS columns.
            Each section is then contained in its own individual div that is a column that will take up one third of the screen's width.
        -->
        <div class="main columns is-multiline is-centered">
        <div class="column is-one-third">
                    <!--
                        Below is the inventory component, which was obtained from Inventory.vue.
                        It is currently identical to the drag-input component except it lacks run and clear console buttons.
                    -->
            <inventory v-bind:problem="problem" />
        </div>
        <div class="column is-one-third">
            <!--
                Below is a drag-input component, which was obtained from DragInput.vue
                The code v-bind:problem="problem" sets the drag-input attribute called problem to always equal what problem value is computed by the JavaScript below.
                @updateOutput="updateOutput" @clearConsole="clearConsole" is saying that, when the corresponding event that comes after the @ occurs, run the JavaScript method whose name will be in quotes.
            -->

            <drag-input v-bind:problem="problem"
             @updateOutput="updateOutput" @clearConsole="clearConsole"/>
        </div>
        <div class="column is-one-third"> 
            <!--
                Below is a code-output component, which was obtained from CodeOutput.vue
                The code v-bind:output="output.data" sets the code-output attribute called output to always equal what this component's output attribute's data is as it is computed by the JavaScript below.
            -->

            <code-output v-bind:output="output.data"/>
        </div>
        </div>
    </div>
</template>

<script>


import CodeOutput from './CodeOutput.vue'
import DragInput from './DragInput.vue'
import Inventory from './Inventory.vue'

/*
The following is exported in order to expose the contained items to the template as well as to make this Main.vue component importable.
*/

export default {
    /*
    This is where the components are registered so they can be visible to the template.
    */
    components: {
        CodeOutput,
        DragInput,
        Inventory
    },
    data() {

        /*
        This is this component's output attribute, which contains an array called data itself.
        */

        return {
            output: {
                data: []
            },
        }
    }, 

    /*
    This computed section refers to attribute(s) whose value will be calculated with a function.
    In this case, the value of the problem attribute will be calculated via the following function.
    */

    computed: {
        problem: function() { 
            /*
            The current problem, as is stored on the client's machine, is retrieved into a variable.
            It is converted from JSON to a JavaScript object via JSON.parse()
            */
            let cur_problem=JSON.parse(window.localStorage.getItem('cur-problem'));

            //For now this is all that is being done with the problem's blocks attribute, it is being logged to the console to confirm that it arrives correctly, which it does.
            console.log('Current problem blocks: ', cur_problem.blocks);
            /*
                != means unequal values
                !== means unequal values or unequal types
                The semantic likely doesn't matter here.
                In any case, if the current problem is not null, the following is returned as the attribute-value pairs of the problem attribute.
            */
            if (cur_problem !== null) {
                return {
                    name: cur_problem.name,
                    //The prompt is set to equal that of the current problem.
                    prompt: cur_problem.prompt, // String
                    //The code is that of the current problem, except shuffled by a method defined below.
                    code: this.shuffle(cur_problem.code), // Object Array
                    //I am unsure what this key attribute is for or why it is set to the current problem's code, I'll have to discover this elsewhere.
                    //n: :key is used as a hint or replacement in v-for typically. Used to update the HTML.
                    key: cur_problem.code,  // Object Array
                    //The answer is set to that of the current problem.
                    answer: cur_problem.answer, // String
                }
            }
            else {
                //If the current problem is null, the values are set to what is below. This most likely needs to be altered.
                return {

                    name: "No problem",

                    prompt: "No problems loaded",
                    //I am unsure why each object in the code array has a title attribute, this may simply be what is displayed by the code block with this attribute. Will discover later.
                    code: [{title: `System.out.print("Hello World");`},],
                    //The value of key is set to be a list containing one empty object. This makes me wonder what the functionality of key is.
                    key: [{},],
                    answer: "Hello World",

                }
            }
        },
    },
    //These are the methods of this component.
    methods: {
        /*
        This method updates the code output displayed, by displaying each part of the value array line-by-line.
        Interestingly, this method does not clear prexisting output, it appends to it. We may want to change this.
        */
        updateOutput(value) {
            this.clearConsole()
            for(let i in value) {
                this.output.data.push(">  " + value[i])
            }
            console.log(this.output.data)
        },
        // Clearing STDOUT, not javascript console.
        // This method does clear all output data.
        clearConsole() {
            this.output.data.splice(0)
        },

        // Force the components to re-render
        reload() {
            // TODO: Find out why this isn't updating the draggable component zones
            this.$forceUpdate();

            // TODO: Get this to work without reloading window
            window.location.reload();
        },

        /*
        This method returns a shuffled array.
        As it is implemented now, it starts with the last element of the array and iterates backwards, but skips the first element of the array.
        For each element it iterates over, it randomly chooses an element to swap it with.
        This element's index will be in the range of 0-i's index.
        We may want to modify this a bit later, at it is very possible that the first element will not be moved, and the method seems a bit restricted with how variable its shuffles are.
        Oh wait, we probably won't be using this method...
        Never mind.
        n: is this used to shuffle the problems on the homepage?
        */
        shuffle(array) {
            console.log('Array before shuffling:', array);
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            console.log('Array after shuffling:', array);
            return array;
        }
    }
}

</script>

<!--
This is the style that the component uses.
The scoped boolean means that these style classes are not shared among other components.
The main CSS class is defined with certain settings.
-->

<style scoped>
.main {
    margin-inline: 0%;
    display: flex;
}
</style>
