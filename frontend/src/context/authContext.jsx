//NOTE : Reviewed on 24th may, 2026
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * [REACT CONTEXT - createContext]
 * Concept: Context provides a way to pass data through the component tree 
 * without having to pass props down manually at every level (prop drilling).
 * We initialize it with 'null' as a starting value.
 */
const AuthContext = createContext(null);

/**
 * [PROVIDER COMPONENT]
 * AuthProvider is a Named Function component that wraps the entire app tree.
 * 
 * Concept: It holds state variables (isAuthenticated, user, loading) and provides
 * authentication actions (login, logout) to all children nested inside it.
 */
export function AuthProvider({ children }) { // 'children' represents all nested components wrapped inside <AuthProvider> (like our App tree) to receive context data
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // [REACT HOOK: useEffect]
    // Runs once upon mounting to check if a persistent session cookie/localStorage exists.
    useEffect(function () {
        // Check if user is "logged in" via localStorage
        const storedUser = localStorage.getItem('axonflow_user');
        if (storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []); // Run Once (because of [] dependency array) 

    // [NAMED FUNCTION] - Perform demo login actions
    function login() {
        const demoUser = {
            id: 'user_demo_123',
            name: 'Demo User',
            email: 'demo@axonflow.ai',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6d28d9&color=fff'
        };
        localStorage.setItem('axonflow_user', JSON.stringify(demoUser));
        setIsAuthenticated(true);
        setUser(demoUser);
    }

    // [NAMED FUNCTION] - Terminate login session actions
    function logout() {
        localStorage.removeItem('axonflow_user');
        setIsAuthenticated(false);
        setUser(null);
    }

    return (
        /* 
          [PROVIDING CONTEXT VALUES]
          Binds authentication state and handler callbacks to the provider value object.
          Any child down the tree can request access to this specific object block.
        */
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * [CUSTOM HOOK - useAuth]
 * A named custom hook wrapper to fetch the current authentication details.
 * 
 * Concept: Uses 'useContext' internally. If any component calls 'useAuth()'
 * outside the '<AuthProvider>' tags, it throws an error.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
