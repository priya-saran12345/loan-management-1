import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const fetchAuth = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setAuth({ user: data.user });
            }
        } catch (error) {
            setAuth(null);
        } finally {
            setLoading(false); // Now setLoading is defined
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

    // Optional: Show loading state while checking authentication
    if (loading) {
        return <div>Loading...</div>; // Or your preferred loading component
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);