import React, { createContext, useEffect, useState } from 'react';

export const AuthContextProvider = createContext();

const AuthContext = (props) => {
    const [authentication, setAuthentication] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? true : false; 
    });

    const login = (token, userName) => {
        localStorage.setItem('token', token);
        localStorage.setItem('name', userName);
        setAuthentication(!!token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setAuthentication(false);
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        setAuthentication(!!token);
    };

    useEffect(() => {
        isAuthenticated(); 
    }, []);

    return (
        <AuthContextProvider.Provider value={{ login, logout, authentication }}>
            {props.children}
        </AuthContextProvider.Provider>
    );
};

export default AuthContext;
