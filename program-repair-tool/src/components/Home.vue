<!--
This is the templete for the home component.
In it is a div with the home-container styling class, and in that div is a header that says "Home".
The tag <problems/> tells Vue to insert the component named "problems" in this location
-->

<template>
    <div class="home-container">
        <h1>Home</h1>
        <problems/>
        
    </div>
</template>

<script>

/*
The problems component is imported from the Problems.vue file
It is then registered as a component, meaning it is visible to the template, by exporting it within the components field.
This is described here: https://vuejs.org/guide/essentials/component-basics.html#using-a-component
*/

import Problems from "./Problems.vue"
export default {
    components: {
        Problems,
    },
}
</script>

<!--
This is the component's style.
In it is the CSS the component will use, which in this case is just the class called home-container, which has some specific settings associated with it.
-->

<style>
    home-container {
        margin: auto;
        width: 50%;
        display: block;
        padding: auto;
    }
</style>