<!--
There is currently an uncertainty on lines 33 and 54.
-->
<!--
The script segment below pertains to the login functionality, which will be removed from the project.
-->

<script setup>
import { useAuth0, AuthState } from "../utils/useAuth0";
const { login, logout, initAuth } = useAuth0(AuthState);

initAuth();
</script>

<!--
Below is the template for this component.
It has a navbar which has three router links, each one directing the user to a different page.
-->
<template>
    <nav class="navbar">
        <div class="row">
            <ul class="navigation">
                <li> <router-link class="link" to="/">Home</router-link></li> |
                <li> <router-link class="link" to="/main">Solve</router-link></li> |
                <li> <router-link class="link" to="/create-problems">Create Problem</router-link></li>
            </ul>
        </div>
        <!--
        The following div will be removed, since it is concerned with the login/logout button.
        -->
        <div class="navbar-end">
            <!--
            I cannot find a class called navbar-item and am uncertain if one exists at all. Could possibly originate from Bulma CSS.
            n: https://bulma.io/documentation/components/navbar/
            -->
            <div class="navbar-item">
                <div class="buttons">
                    <!-- Check that the SDK client is not currently loading before accessing is methods -->
                    <div v-if="!AuthState.loading">
                        <!-- show login when not authenticated -->
                        <a v-if="!AuthState.isAuthenticated" @click="login()" class="button is-dark"><strong>Sign in</strong></a>
                        <!-- show logout when authenticated -->
                        <a v-if="AuthState.isAuthenticated" @click="logout()" class="button is-dark"><strong>Log out</strong></a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>

export default {
    //Once more, not certain why this component has a name while others do not.
    name: 'Header',
    //The following methods will be removed, as they pertain to logging in and out.
    methods: {
        // Log the user in
        login() {
		
			console.log('in login()');

			console.log('trying it now');
            this.$auth.loginWithRedirect();
			console.log('tried it');
        },
        // Log the user out
        logout() {
            this.logout({
                returnTo: window.location.origin
            });
        }
    }
}
</script>

<!--
Below is the styling for this component, and again the scoped boolean is deprecated and should not be used.
-->

<style scoped>
    img {
        width:100px;
        transition: 0.5s ease all;
    }
    li {
        text-transform: uppercase;
        padding: 16px;
        margin-left: 0px;
    }

    nav {
        position: bottom;
        display: flex;
        flex-direction: row;
        padding: 12px 0;
        transition: 0.5s ease all;
        width: 95%;
        margin: 0 auto;
        @media (min-width: 1140px){
            max-width: 1140px;
        }
    }
    .link {
        font-size: 14px;
        transition: 0.5s ease all;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;
    
}
    ul, .link { 
        font-weight:500;
        color:rgba(17, 148, 28, 0.9);
        list-style: none;
        text-decoration: none;
    }
    :hover {
        color: crimson;
        border-color: aqua;
    }
    .navigation {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: flex;
    }
    .navbar-end {
        float: right;
    }
</style>