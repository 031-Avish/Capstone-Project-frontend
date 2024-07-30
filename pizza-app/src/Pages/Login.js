import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';

import AuthContext from "../store/auth-context";
import { loginUser } from "../utils/api";
import Spinner from "../Components/Spinner";
export default function Login() {
    const {showAlert} = useContext(AuthContext);  
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const authContext = useContext(AuthContext);
    const [isLoding, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try{
            if(!isLoding){
                const response = await loginUser({
                    email,
                    password
                });
                console.log(response);
                authContext.login(response.token);
                showAlert('Login Successful','success');
                // replace true because we don't want the user to go back to the login page
                navigate('/',{replace:true});
                
            }
            setIsLoading(false);
        }
        catch(error){
            // console.log(error);
            showAlert(error.errorMessage || error.title || "Something went wrong",'danger');
            setIsLoading(false);
        }
    }
    
    return (
        <>
        <div className =" w-full h-4/5 grid grid-cols-1 md:grid-cols-2 justify-items-center items-center">
        <div className="loginForm rounded-2xl w-11/12 md:w-8/12 h-4/5 md:h-5/6 p-5">
            <div className="loginForm__title text-5xl font-medium">
                Login
            </div>
            <div className="loginForm__subtitle py-5 text-base">
                Don't Have an Account ? 
                <span className="ml-2 text-amber-400 font-medium">
                    <Link to="/signup">Sign Up</Link>
                </span>
            </div>
            <div className="loginForm__form">
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="block">
                            <span className="text-gray-700">Email</span>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} className=" mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='something@gmail.com' required/>
                        </label>
                    </div>
                    <div className="mb-3">
                                <label className="block">
                                    <span className="text-grey-700">Password</span>
                                    <input type='password' onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='Password' required />
                                </label>
                            </div>
                            <div className="my-10">
                                {
                                    !isLoding
                                        ?
                                        <button className="bg-amber-400 text-white py-3 w-24 rounded-full" type="submit">
                                            Login
                                        </button>
                                        :
                                        <div className="flex items-center justify-center">
                                            <Spinner />
                                        </div>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1489564239502-7a532064e1c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')] bg-right bg-no-repeat w-full h-full">

                </div>
            </div>
        </>
    );
}
