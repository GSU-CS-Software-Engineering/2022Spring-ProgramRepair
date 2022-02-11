<template>
    <div class="main">
        <div>
            <drag-input v-bind:problem="problem"
             @updateOutput="updateOutput" @clearConsole="clearConsole"/>
        </div>
        <div> 
            <code-output v-bind:output="output.data"/>
        </div>
    </div>
</template>
<script>
import CodeOutput from './CodeOutput.vue'
import DragInput from './DragInput.vue'

export default {
    components: {
        CodeOutput,
        DragInput
    },
    data() {
        return {
            output: {
                data: []
            },
        }
    }, 
    computed: {
        problem: function() { 
            let cur_problem=JSON.parse(window.localStorage.getItem('cur-problem'));
            if (cur_problem !== null) {
                return {
                    prompt: cur_problem.prompt, // String
                    code: this.shuffle(cur_problem.code), // Object Array
                    key: cur_problem.code,  // Object Array
                    answer: cur_problem.answer, // String
                }
            }
            else {
                return {
                    prompt: "No problems loaded",
                    code: [{title: `System.out.print("Hello World");`},],
                    key: [{},],
                    answer: "Hello World",

                }
            }
        },
    },
    methods: {
        updateOutput(value) {
            for(let i in value) {
                this.output.data.push(">  " + value[i])
            }
        },
        // Clearing STDOUT, not javascript console.
        clearConsole() {
            this.output.data.splice(0)
        },
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }
}

</script>
<style scoped>
.main {
    margin-inline: 15%;
    display: flex;
}
</style>
