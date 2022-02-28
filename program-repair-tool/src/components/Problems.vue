<!--
Right now there are uncertainties on lines 11, 15, and 47.
-->
<!--
Below is this component's template.
-->
<template>
    <div class="problems">
        <h3>Problem Selection</h3>
        <!-- 
        I cannot find a CSS class called problem-list, I am uncertain if it is elsewhere or was just never used.
        -->
        <ul class= "problem-list">
            <!--
            Again, not fully certain of semantics about the key, but that may not be a problem.
            A list element is created for every problem in the problems list.
            When a problem's name is listed it will be a link that takes the user to the main page after setting the current problem to the one clicked on, so that will be the problem displayed on the main page.
            A remove button is also next to each problem, and will run the removeProblem function on the problem's name when clicked.
            Underneath all the problems is a print button, which will print all problems to the console.
            -->
            <li v-for="problem in problems" :key="problem">
                <a href="./main" @click="setProblem(problem)"><strong>{{ problem.name }}</strong></a>
                <button class="removeProblem" @click="removeProblem(problem.name)">remove</button>
            </li>
        </ul>
        <button @click="print">Print</button>
    </div>
</template>

<script>  
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
                return JSON.parse(window.localStorage.getItem('problems')) || []
            },
        }
    },
    methods: {
        //This method prints the problems to the console.
        print() {
            console.log(this.problems)
        },
        // For loading a problem that is clicked on
        //This method sets the current problem to the one provided as an argument, converting it to a JSON formatted String first, and then prints the current problem to the console.
        setProblem(problem) {
            window.localStorage.setItem('cur-problem', JSON.stringify(problem));
            console.log(JSON.parse(window.localStorage.getItem("cur-problem")))
        },
        //This method deletes the problem that has the same name as the itemName argument.
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
This is the component's style, and once again the scoped boolean is deprecated and should be removed.
-->

<style scoped>
    .problems {
        margin: auto;
        width: 50%;
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