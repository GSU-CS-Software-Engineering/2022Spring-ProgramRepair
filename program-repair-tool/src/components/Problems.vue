<!--
Right now there are uncertainties on lines 17 and 59.
-->
<!--
Below is this component's template.
In it is a div that uses a problems class that is defined in the syle section, as well as several Bulma CSS classes.
The columns class specifies that this div will hold columns.
The is-vcentered class specifies that column elements will be vertically centered with each other.
The is-multiline class will cause a new row to be started automatically when the current one runs out of room.
The is-centered class will make it so that columns will be horizontally centered.
For example, if there are an odd number of problems, the last problem card, having its own row, will be aligned to the center and not the left.
For more information, see: https://bulma.io/documentation/columns/options/
-->
<template>
    <div class="problems columns is-vcentered is-multiline is-centered">
            <!--
            Again, not fully certain of semantics about the key, but that may not be a problem.
            A div is created for every problem in the problems list.
            This div will be a column and take up half the width of the screen.
            -->
            <div v-for="problem in problems" :key="problem" class="column is-half">
                <!--
                    Within each div is a card, which will call the setProblem method with the current problem as a paramater when clicked.
                    The card's header will be the problem's name, and its content will be the problem's prompt.
                -->
                <div class="card" @click="setProblem(problem)">
                    <header class="card-header">
                        <p class="card-header-title">
                            {{ problem.name }}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            {{ problem.prompt }}
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>  

import fetchProblems from "../utils/middleware.js";

export default {
    /*
    Once again this component is named while others aren't.
    The problem prop has the four fields of each problem.
    */
    name: 'Problems',
    props: {
        problem: {
            name: String,
            prompt: String,
            code: Array,
            answer: String,
        }
    },
    /*
    The computed value is the list of problems, which is either converted from JSON into a JavaScript Object or an empty array if no item named problems exists in localStorage.
    I'm uncertain of the semantics behind the get: word, but it seems to work as expected, by setting the value of problems to what the function returns.
    */
    computed: {
        problems: {
            get: function() {
                console.log(fetchProblems());
            },
        }
    },
    methods: {
        /*
        This method prints the problems to the console.
        It is unused as of now.
        */
        print() {
            console.log(this.problems)
        },
        // For loading a problem that is clicked on
        /*
        This method sets the current problem to the one provided as an argument, converting it to a JSON formatted String first, and then prints the current problem to the console.
        It brings the user to the solving page after this is done.
        */
        setProblem(problem) {
            window.localStorage.setItem('cur-problem', JSON.stringify(problem));
            console.log(JSON.parse(window.localStorage.getItem("cur-problem")));
            window.location.href="./main";
        },
        /*
        This method deletes the problem that has the same name as the itemName argument.
        It is unused as of now.
        */
        removeProblem(itemName) {
            //The confirm method will alert the user with this message, and only return true if they click "OK" and not "Cancel".
            if (confirm("Are you sure you want to delete this problem?")) {
                /*
                This loop iterates through problems until it finds the one with the same name as itemName, then deletes it from the array.
                The problems item is then removed from localStorage and then a new problems item is added to localStorage by converting the JavaScript object problems into a JSON formatted String.
                This effectively updates the stored list of problems.
                There are a few error handling concerns with this, but deleting problems is likely not a functionality we will support.
                */

                for (var i = 0; i < this.problems.length; i++) {
                    if (this.problems[i].name == itemName) {
                        this.problems.splice(i,1)
                        break;
                    }
                }
                localStorage.removeItem('problems');
                localStorage.setItem('problems', JSON.stringify(this.problems))
            }
        }
    }
    
}
</script>

<!--
This is the component's style.
Only the problems class is actually used, but the others are kept for now just in case.
-->

<style>
    .problems {
        margin: auto;
        padding: 10px;
        display: block;
    }
    .removeProblem {
        float:right;
    }
    ul {
        margin: auto;
        list-style-type: none;
        background-color: rgb(231, 231, 231);
        padding: 5px 10px;
    }
    li {
        text-align: left;
        padding: 5px;
    }
</style>