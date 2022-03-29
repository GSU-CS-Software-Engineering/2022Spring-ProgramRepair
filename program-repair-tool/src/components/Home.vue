<!--
This is the template for the home component.
In it is a div with the home-container styling class, and in that div is a header that says "Home".
The tag <problems/> tells Vue to insert the component named "problems" in this location
-->

<template>
    <div class="home-container">
        <h1 class="title has-text-left p-2">Welcome to the Program Repair tool!</h1>
        <h2 class="subtitle has-text-left p-2">Please click on a problem below to be taken to a page where you can attempt to solve it.</h2>
        <hr />
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
I believe they may be missing a "." in front of home-container.
It seems that what they have now is trying to change the settings of an HTML element titled home-container, and there isn't one as far as I can tell.
A "." in front of it would specify to CSS that this is a class, which seems to be its intention.
-->

<style>
    home-container {
        margin: auto; 
        width: 50%; 
        display: block; 
        padding: auto;
        text-align: left;
    }
</style>