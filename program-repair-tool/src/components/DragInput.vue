<template>
    <div class="drag-input" :output="output">
        <h3 class="header">Prompt: {{ problem.prompt }}</h3>
        <div class="container">
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
        <div>
            <button class="button" @click="run">Run</button>
            <button class="button" @click="clearConsole">Clear Console</button>
        </div>
    </div>
</template>
<script>
import Draggable from 'vue3-draggable'
import * as Interpreter from "./interpreter/Interpreter.js"

export default {
    components: {
        Draggable
    },
    props: {
        problem: Object
    },
    data() {
        return {
            output: String
        };
    },
    methods: {
        async run() {
            console.clear()
            // Converting drag/drop components to strings, then running through interpreter
            var blocks_list = ''
            this.$props.problem.code.forEach(x => {
                blocks_list += `${x.title}\n`
            })
            let undefined;  // constructor requires two arguments and has checks for undefined
            let i = new Interpreter.Interpreter(blocks_list, undefined)
            i.run()
            
            // Submitting output for rendering to STDOUT
            let output_array = i.get_output();
            output_array.join(",")
            await this.$emit("updateOutput", output_array)
            let cur_problem=JSON.parse(window.localStorage.getItem('cur-problem')) || {answer: "Hello World"};
            if(cur_problem.answer == output_array) {
                console.log("VALID")
                alert("Congratulations! You're correct!")
            }
            else {
                alert("Try Again. You can do this!")
            }
            },
        clearConsole() {
            this.$emit("clearConsole")
        },
    }
};
</script>
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