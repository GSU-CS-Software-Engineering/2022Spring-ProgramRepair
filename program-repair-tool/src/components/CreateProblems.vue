<!--
There are uncertainties currently on lines 46 and 75.
-->
<!--
Below is this component's template.
-->
<template>
    <div class="create-problems">
        <h3>Create Problems</h3>
        <form>

            <!--
            Below is a table that contains the problem input form.
            Each text field is required and has its value bound to an attribute kept in the data section, meaning they will always be the same.
            -->

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
        <!--
        This is the create button, which will call the create function when it is called.
        -->
        <button @click="create">Create</button>
    </div>

</template>
<script>
export default {
    /*
    Again, uncertain why this component has a name while others do not.
    */

    name: "CreateProblems",
    data() {
        /*
        The data is a problem with the four following fields, all initially empty.
        The prompt is essentially what we will have as the problem description.
        The code, however, will not be used by us since users will build their solutions from scratch.
        */
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
                //This line creates an array where each element is a line of code and stores it in a variable raw_code_arr
                let raw_code_arr = this.problem.code.split("\n");
                /*
                The following line changes raw_code_arr from an array of Strings into an array of title attributes where each title's value corresponds to a String in the original array.
                I am uncertain why exactly this is done at the moment, although this does show that the title simply is the line's contents.
                */
                raw_code_arr = raw_code_arr.map(function(x) { 
                    return { title: x }
                });
                //A problem variable is created and the values of the attributes are set accordingly.
                let prob = {
                    name: this.problem.name, 
                    prompt: this.problem.prompt, 
                    code: raw_code_arr,
                    answer: this.problem.answer
                };
                //The problem is then saved.
                this.saveFile(prob);
            }
        },
        saveFile(prob) {
            if (window.localStorage.getItem('problems') !== null) {
                /*
                If localStorage already has an item named problems, it will first be converted to a JavaScript object before it is saved as a variable.
                Next the newly created problem will be added to this list.
                Finally, the problems item in localStorage will be set to the updated problem_list variable, after it is converted back into a JSON formatted String.
                */
                var problem_list = JSON.parse(window.localStorage.getItem('problems'))
                problem_list.push(prob);
                window.localStorage.setItem('problems', JSON.stringify(problem_list));
            }
            else {
                /*
                If localStorage does not already have an item named problems, convert an array containing only the newly created problem in a JSON formatted String.
                Then save it to localStorage and name it problems.
                */
                const data = JSON.stringify([prob]);
                window.localStorage.setItem('problems', data);
            }
            alert("Successfully added")
        },
        //The below method performs input validation.
        errors() {
            let errors = [];
            //For every field of this component's problem, if it has a value of an empty String, then this field's name is added to a list of errors.
            for (var key in this.problem) {
                if (this.problem[key] == "") {
                    errors.push(key)
                }
            }
            /*
            If there are one or more errors, display an error message that lists all of the empty fields.
            Each empty field's name will be separated by a new line and a tab.
            This is the part of the code that is dubious, as it does not return true to signal that errors were detected, causing the problem to be added anyway.
            However, since our project will not involve student users adding problems, this is not a concern anyway.
            */
            if (errors.length > 0) {
                let error_message = "Empty Field(s)\n\n\t" + errors.join("\n\t");
                alert(error_message)
            }
        }
    },
}
</script>

<!--
Below is the styling, and once again the scoped boolean is deprecated and should not be used.
-->
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