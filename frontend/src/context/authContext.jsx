import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is "logged in" via localStorage
        const storedUser = localStorage.getItem('axonflow_user');
        if (storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = () => {
        const demoUser = {
            id: 'user_demo_123',
            name: 'Demo User',
            email: 'demo@axonflow.ai',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6d28d9&color=fff'
        };
        localStorage.setItem('axonflow_user', JSON.stringify(demoUser));
        setIsAuthenticated(true);
        setUser(demoUser);
    };

    const logout = () => {
        localStorage.removeItem('axonflow_user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
