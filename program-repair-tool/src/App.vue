<template>
  <div>
    <Header/>
    <hr>
    <div id="nav">
    </div>
    <div>
      <router-view />
    </div>
    <hr>
    <Footer msg="Welcome to Our Vue.js Program Repair Tool!"/>
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

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
