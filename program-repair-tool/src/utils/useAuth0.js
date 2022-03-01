/*
This entire file is concerned with authorizing logins.
Seeing as login functionality will not be a part of our project, this file can be ignored.
*/
// utils/useAuth0.js
import createAuth0Client from '@auth0/auth0-spa-js';
import { reactive } from 'vue';
// Import the Auth0 configuration
import { domain, clientId } from '../../auth_config.json';

export const AuthState = reactive({
    user: null,
    loading: false,
    isAuthenticated: false,
    auth0: null,
});

const config = {
    domain: domain,
    client_id: clientId
};


export const useAuth0 = (state) => {
    const handleStateChange = async () => {
        state.isAuthenticated = !!(await state.auth0.isAuthenticated());
        state.user = await state.auth0.getUser();
        state.loading = false;
    }

    const initAuth = () => {
        state.loading = true;
        createAuth0Client({
            domain: config.domain,
            client_id: config.client_id,
            cacheLocation: 'localstorage',
            redirect_uri: window.location.origin
        }).then(async auth => {
            state.auth0 = auth;
            await handleStateChange();
        });        
    }

    const login = async () => {
        await state.auth0.loginWithPopup();
        await handleStateChange();
    };

    const logout = async () => {
        state.auth0.logout({
            returnTo: window.location.origin,
        });
    }

    return {
        login,
        logout,
        initAuth,
    }

}