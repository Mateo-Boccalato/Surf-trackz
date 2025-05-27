import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import { ID } from 'appwrite';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            console.log('Check user error:', error);
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            await account.createEmailSession(email, password);
            await checkUser();
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    };

    const register = async (email, password, name) => {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            console.log('Registration response:', response);
            
            // Only attempt login if registration was successful
            if (response.$id) {
                await login(email, password);
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Failed to create account');
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 