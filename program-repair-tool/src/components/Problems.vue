<template>
    <div class="problems">
        <h3>Problem Selection</h3>
        <ul class= "problem-list">
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
    name: 'Problems',
    props: {
        problem: {
            name: String,
            prompt: String,
            code: Array,
            answer: String,
        }
    },
    computed: {
        problems: {
            get: function() {
                return JSON.parse(window.localStorage.getItem('problems')) || []
            },
        }
    },
    methods: {
        print() {
            console.log(this.problems)
        },
        // For loading a problem that is clicked on
        setProblem(problem) {
            window.localStorage.setItem('cur-problem', JSON.stringify(problem));
            console.log(JSON.parse(window.localStorage.getItem("cur-problem")))
        },
        removeProblem(itemName) {
            if (confirm("Are you sure you want to delete this problem?")) {
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