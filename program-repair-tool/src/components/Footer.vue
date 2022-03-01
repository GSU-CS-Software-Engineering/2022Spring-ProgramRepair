<!--
Uncertainties currently exist at lines 6 and 18.
-->
<!--
Below is this component's template.
I cannot find a class named hello and am uncertain if one exists, and if it does, where it originates.
In any case, the value of the msg prop will be displayed
-->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  /*
  Once again I am uncertain why this component is named while the others are not.
  There is a msg prop which is a String, and a higher level component that uses this one can supply a value to msg.
  */
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--
Below is the component's style.
The scoped boolean is deprecated and should not be used.
-->
<style scoped>
h1 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
