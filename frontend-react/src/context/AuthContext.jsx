'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Cargar usuario del localStorage al iniciar
    useEffect(() => {
        const userData = localStorage.getItem('spotmarket_user');
        if (userData) {
            setUsuario(JSON.parse(userData));
        }
        setCargando(false);
    }, []);

    // Iniciar sesión
    const login = (userData) => {
        localStorage.setItem('spotmarket_user', JSON.stringify(userData));
        setUsuario(userData);
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            await fetch('http://localhost:4004/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        localStorage.removeItem('spotmarket_user');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}