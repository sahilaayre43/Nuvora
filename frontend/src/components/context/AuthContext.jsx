import React, {createContext, useCallback, useState} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('userInfo'));
        } catch {
            return null;
        }
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};