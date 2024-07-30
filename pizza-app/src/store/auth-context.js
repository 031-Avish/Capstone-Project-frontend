import React,{useEffect , useState} from "react";
import jwt from 'jwt-decode';

// create a context
const AuthContext = React.createContext({
    token:'',
    user:{},
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null);
    // check if the token is saved in the local storage 
    // useEffect is used to run the code only once when the component is mounted

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
    },[]);

    // check if the token is null or not
    const userIsLoggedIn = token === null ? false : true;

    // decode the token using jwt-decode
    const user = token === null ? {} : jwt(token);

    // login and logout handlers
    const loginHandler = (token) => {
        setToken(token);
        alert('Logged in successfully');
        localStorage.setItem('token', token);
    }

    const logoutHandler = () => {
        setToken(null);
        alert('Logged out successfully');
        localStorage.removeItem('token');
    }

    // context value to be passed to the provider
    const contextValue = {
        token: token,
        user: user,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }

    return (
        // pass the context value to the provider 
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
