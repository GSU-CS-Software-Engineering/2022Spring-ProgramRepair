<template>
    <div class="create-problems">
        <h3>Create Problems</h3>
        <form>
            <table>
                <tr>
                    <td><label for="name">Name: </label></td>
                    <td><textarea v-model="problem.name" rows="1" cols="50" name="name" id="name" placeholder="Clever name for your problem" required/></td>
                </tr>
                <tr>
                    <td><label for="prompt">Instructions: </label></td>
                    <td><textarea v-model="problem.prompt" name="prompt" id="prompt" rows="3" cols="50" placeholder="How do you solve the problem?" required/></td>
                </tr>
                <tr>
                    <td><label for="code">Code: </label></td>
                    <td><textarea v-model="problem.code" name="code" id="code" rows="6" cols="50" placeholder="Write out the code you want to publish" required/></td>
                </tr>
                <tr>
                    <td><label for="answer">Answer: </label></td>
                    <td><textarea v-model="problem.answer" name="answer" id="answer" rows="2" cols="50" placeholder="Separate multiple outputs using commas (1,2,3)" required/></td>
                </tr>
            </table>           
        </form>
        <button @click="create">Create</button>
    </div>

</template>
<script>
export default {
    name: "CreateProblems",
    data() {
        return {
            problem: {
                name: ``,
                prompt: ``,
                code: ``,
                answer: ``
            },
        }
    },
    methods: {
        // Creates new problem and stores it locally
        create() {
            if (this.errors()) return; // Preventing empty problems from being added to the list
            else {
                // Formatting code input
                let raw_code_arr = this.problem.code.split("\n");
                raw_code_arr = raw_code_arr.map(function(x) { 
                    return { title: x }
                });
                let prob = {
                    name: this.problem.name, 
                    prompt: this.problem.prompt, 
                    code: raw_code_arr,
                    answer: this.problem.answer
                };
                this.saveFile(prob);
            }
        },
        saveFile(prob) {
            if (window.localStorage.getItem('problems') !== null) {
                var problem_list = JSON.parse(window.localStorage.getItem('problems'))
                problem_list.push(prob);
                window.localStorage.setItem('problems', JSON.stringify(problem_list));
            }
            else {
                const data = JSON.stringify([prob]);
                window.localStorage.setItem('problems', data);
            }
            alert("Successfully added")
        },
        errors() {
            let errors = [];
            for (var key in this.problem) {
                if (this.problem[key] == "") {
                    errors.push(key)
                }
            }
            if (errors.length > 0) {
                let error_message = "Empty Field(s)\n\n\t" + errors.join("\n\t");
                alert(error_message)
            }
        }
    },
}
</script>

<style scoped>
    .create-problems {
        display: block;
        margin: auto;
        width: 700px;
    }
    label {
        float: left;
    }
    input, textarea {
        float: right;
    }
    td {
        padding-inline: 20px;
    }
    textarea {
        resize: vertical;
    }

</style>