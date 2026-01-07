import React, { createContext, useState, useEffect } from 'react';
import { initDB, getUser, addUser } from '../db/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Initial load for DB init could go here if needed

    useEffect(() => {
        initDB()
            .then(() => console.log('DB Initialized'))
            .catch(e => console.log('DB Init Error: ', e));
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await getUser(email, password);
            if (userData) {
                setUser(userData);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            await addUser(username, email, password);
            // Auto login after register? Or just return success
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
