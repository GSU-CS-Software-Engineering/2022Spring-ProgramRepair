<template>
    <!--
    This is the component for the block inventory section.
    Right now it is mostly a copy of the workspace section component, which is DragInput.vue.
    When compared to the workspace section, this one lacks the "Run" and "Clear Console" buttons as well as the associated methods.
    This will be changed later.
    -->
    <div class="drag-input">
        <h3 class="header">Inventory:</h3>
        <!--
        This div holds the part of the screen where code blocks can be dragged around.
        -->
        <div class="inventory-container">
            <!--
            The following draggable tag is a component that was imported below.
            v-model="problem.code" will make it so that the code field of the problem attribute of the draggable component will match the code field of the problem attribute of this component, which is declared below.
            The code transition="100" does not seem to do anything, I am not sure what the intention was, but maybe we'll put time into making the interface more animated.
            The draggable component has class drop-zone, which is defined in the style section.
            There is an inner template which I assume is used to represent the content inside the draggable area.
            The code v-slot:item="{ item }" specifies that this slot, which is contained in this template, will have an attribute named item with the value of an attribute named item from the parent, and this originates from Main.vue.
            For more information on v-slot check: https://vuejs.org/guide/components/slots.html
            There is a div with a draggable-item class, which is defined in the style below, and within the div the item is displayed.
            In effect this creates the blocks for each element inside the code array.
           unexoected mutatation of problem prop line 33
            -->
            <draggable
                v-model="problem.code"
                transition="100"
                class="drop-zone">
                <template v-slot:item="{ item }">
                    <div class="draggable-item">
                    {{ item }}
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script>
import Draggable from 'vue3-draggable'


export default {
    name: 'Inventory',
    //Draggable is registered as a component, which allows it to be used in the template above.
    components: {
        Draggable
    },
    //This component has a prop called problem, which is an Object.
    //It is a prop as opposed to data so that a value can be passed in from a higher level component that uses this one, and this is shown in Main.vue line 21.
    props: {
        problem: Object
    },

};
</script>

<!--
Several CSS classes are defined and they are used in the above code.
-->

<style scoped>
    .inventory-container {
    width: 500px;
    display: flex;
    flex-direction: row;
    }
    .draggable-item {
    display: flex;
    justify-content: center;
    background-color: lightblue;
    box-shadow: 0px 2px 5px #aaa;
    margin: 1%;
    padding: 1%;
    }
    .drop-zone {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 3px 5px #aaa;
    margin: 30px;
    padding: 10px;
    width: 400px;
    min-height: 200px;
    height: auto !important;
    }
    .header {
        padding-inline: 20px;
        padding-left: 30px;
        text-align: left;
        
    }
</style>
