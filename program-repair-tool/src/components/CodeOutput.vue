<!--
Right now there is a minor uncertainty on line 32.
-->
<!--
Below is this component's template.
First is a div that has an attribute called output, which is set to always equal the value of the output prop below.
-->
<template>
    <div class="code-output" v-bind:output="output" >
        <h3 class="header">Output:</h3>
        <ul class="output">
            <!--
            The code below creates a list element for every entry inside of the output arrary.
            The :key attribute is used to accurately iterate through the area.
            I do not understand the deep semantics of this, but it seems to just be a way to identify each entry and works appropriately.
            -->
            <li
                v-for="(entry, index) in output" 
                :key="index">
                {{ entry }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {

    /*
    Below this component is given a name and a prop, which is an array called output.
    output being a prop means that a value can be passed in by a higher level component that uses this one.
    I am uncertain why this component has a name while others do not, or even if it matters.
    */

    name: 'CodeOutput',
    props: {
        output: Array
    },
    
}
</script>

<!--
Not sure why they removed the margin setting, may experiment with that.
n: margin is set to auto in CreateProblems; should it be the same everywhere?
-->

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
        padding-left: 0px;
    }
    .output {
        background-color: rgb(231, 231, 231);
        width: 430px;
        height: 300px;
    }
</style>
