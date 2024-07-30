import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'; // Correct import statement

// Create a context
const AuthContext = React.createContext({
    token: '',
    user: {},
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    showAlert: () => {},
});

// Alert Component
const Alert = ({ message, type, onClose }) => {
    if (!message) return null;
    
    const modalType = type === 'danger' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';

    return (
        <div className="fixed inset-x-0 top-5 flex items-center justify-center z-50">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        {/* Alert box */}
        <div className="bg-white rounded-lg shadow-lg w-80 relative">
            <div className={`px-4 py-2 rounded-t-lg ${modalType}`}>
                <h5 className="text-lg font-bold">
                    {type === 'danger' ? 'Error!' : 'Success!'}
                </h5>
            </div>
            <div className="p-4">
                <p>{message}</p>
            </div>
            <button
                className="absolute top-2 right-2 text-lg"
                onClick={onClose}
            >
                &times;
            </button>
        </div>
    </div>
    );
};

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });

    // Check if the token is saved in the local storage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
    }, []);

    // Check if the token is null or not
    const userIsLoggedIn = token !== null;

    // Decode the token using jwtDecode
    const user = token ? jwtDecode(token) : {};

    // Login and logout handlers
    const loginHandler = (token) => {
        setToken(token);
        showAlert('Logged in successfully', 'success');
        localStorage.setItem('token', token);
    };

    const logoutHandler = () => {
        setToken(null);
        showAlert('Logged out successfully', 'success');
        localStorage.removeItem('token');
    };

    // Show alert function
    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), 4000); // Auto-close after 4 seconds
    };

    // Context value to be passed to the provider
    const contextValue = {
        token: token,
        user: user,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        showAlert, // Add showAlert to the context value
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
            <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: '', type: '' })}
            />
        </AuthContext.Provider>
    );
};

export default AuthContext;
