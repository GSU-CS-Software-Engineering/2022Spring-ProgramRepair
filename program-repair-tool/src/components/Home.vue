<template>
    <div class="home-container">
        <h1>Home</h1>
        <problems/>
        
    </div>
</template>

<script>
import Problems from "./Problems.vue"
export default {
    components: {
        Problems,
    },
}
</script>
<style>
    home-container {
        margin: auto;
        width: 50%;
        display: block;
        padding: auto;
    }
</style>