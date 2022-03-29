<!--
This is the Middleware component, whose only purpose is to get the available problems from the server and emit a gotProblems event with the information obtained.
As such it has no visuals, it lacks anything in its template or style sections.
It does however still have to be a Vue component, in order for event emitting to be available.
-->
<template>
    
</template>

<script>

export default {

name: 'Middleware',

methods: {

/*
Below is the method that will fetch the problems from the server.
If there is a network error of some kind, the action to take, in this case alerting the user, will be within catch.
Currently, if a response is obtained, and the response status is not 200, an alert is created that displays the response status to the user.
Otherwise the gotProblems event is sent along with the available problems obtained from the server, now in JavaScript object form.
*/

async fetchProblems() {
    const response = await fetch('http://localhost:3080/api/problemlist', {
        headers: {
            'Accept': 'application/json'
        }
    }).catch(() => alert("Error! The server could not be reached."));

    if (response.status !== 200) {
        alert("Error! Response status " + response.status + " was obtained from the server.");
    }

    else {
        const data = await response.json();
        console.log(data);
        await this.$emit("gotProblems", data);
    }

},

},

/*
The beforeMount method will execute as soon as the Middleware component is loaded in, which is whenever the home page is loaded in.
So, whenever Home.vue is loaded in, this component's fetchProblems method will be called automatically.
*/

beforeMount() {
    console.log('Middleware beforeMount activated.');
    this.fetchProblems();
},

};

</script>

<style>

</style>
