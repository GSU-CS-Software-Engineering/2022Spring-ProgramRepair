<template>
    <div class="code-output" v-bind:output="output" >
        <h3 class="header">Stdout:</h3>
        <ul class="output">
            <li
                v-for="entry in output" 
                :key="entry">
                {{ entry }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'CodeOutput',
    props: {
        output: Array
    },
    
}
</script>

<style scoped>
    ul {
        list-style-type: none;
        /* margin: 10px; */
        padding: 10px;
        overflow: auto;
    }
    .code-output {
        padding-inline: 20px;
        text-align: left;
    }
    .header {
        padding-left: 10px;
    }
    .output {
        background-color: rgb(231, 231, 231);
        width: 500px;
        height: 300px;
    }
</style>
