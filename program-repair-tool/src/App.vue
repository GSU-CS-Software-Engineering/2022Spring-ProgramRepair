<!--
There are currently uncertainties on lines 20, 45.
-->
<!--
Below is this component's template.
-->
<template>
  <div>
    <!--
    Below is the Header component.
    -->
    <Header/>
    <!--
    The hr tag stands for horizontal rule, a thematic break in the page.
    See: https://www.w3schools.com/tags/tag_hr.asp
    -->
    <hr>
    <!--
    Below is a div with id nav.
    Currently uncertain about how this interacts with the header component, if at all, may need to look into that.
    It most likely is just used for formatting purposes.
    -->
    <div id="nav">
    </div>
    <div>
      <!--
      The router-view element will become the component that is currently being pointed to by the router.
      -->
      <router-view />
    </div>
    <hr>
    <!--
    Below is the Footer component with a String value passed into its msg prop.
    -->
    <Footer msg="Welcome to Our Vue.js Program Repair Tool!"/>
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  /*
  Still uncertain why this component has a name and others do not.
  Beneath that line, the Header and Footer components are registered as such, so that they can be placed inside the template.
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
