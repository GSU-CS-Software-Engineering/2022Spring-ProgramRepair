<!--
There is currently an uncertainty on line 22.
-->
<!--
Below is this component's template.
-->
<template>
  <div>
      <!--
      The router-view element will become the component that is currently being pointed to by the router.
      -->
      <router-view />
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  /*
  Still uncertain why this component has a name and others do not.
  Beneath that line, the Header and Footer components are registered as such, so that they can be placed inside the template.
  They are as of now unused.
  */
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<!--
Below is this component's styling.
While there is not an element with id "app" in this componenet's template, there is in /public/index.html
There is no longer an element with id "nav", although the style is kept for now just in case.
-->
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 20px; */
}
#nav {
  margin-bottom: 40px;
}
</style>
