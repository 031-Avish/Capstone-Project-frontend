import { useContext,useState } from "react";    
import { Link,useNavigate } from "react-router-dom";

import AuthContext from "../store/auth-context";
import { signupUser } from "../utils/api";
import Spinner from "../Components/Spinner";

export default function Signup() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const {showAlert} = useContext(AuthContext);
    const handleSignup = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if(!isLoading){
            const response = await signupUser({
                email,
                password,
                name,
                phone
            });
            if(response.error){
                alert(response.message);
            }
            else{
                alert('Signup successful');
                navigate('/login',{replace:true});
            }
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="w-full h-4/5 grid grid-cols-1 md:grid-cols-2 justify-items-center items-center">
                <div className="signupForm rounded-2xl w-11/12 md:w-8/12 p-5">
                    <div className="signupForm__title text-5xl font-medium">
                        Sign Up
                    </div>

                    <div className="loginForm__subtitle py-5 text-base">
                        Already have an account?
                        <span className="ml-2 text-sky-400 font-medium">
                            <Link to='/login'>
                                Login
                            </Link>
                        </span>
                    </div>

                    <div className="loginForm__form">
                        <form onSubmit={handleSignup}>
                        <div className="mb-3">
                                <label className="block">
                                    <span className="text-grey-700">Name</span>
                                    <input type='text' onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='Enter Your Name' required />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label className="block">
                                    <span className="text-grey-700">Email</span>
                                    <input type='email' onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='Enter Your Email' required />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label className="block">
                                    <span className="text-grey-700">Phone Number</span>
                                    <input type='text' minLength='10' maxLength='10' onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='Enter Phone Number' required />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label className="block">
                                    <span className="text-grey-700">Password</span>
                                    <input type='password' onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder='Password' required />
                                </label>
                            </div>
                            <div className="mt-6">
                                {
                                    !isLoading
                                        ?
                                        <button className="py-3 w-24 bg-sky-400 text-white rounded-full" type="submit">
                                            Sign Up
                                        </button>
                                        :
                                        <div className="flex items-center justify-center">
                                            <Spinner />
                                        </div>
                                }
                            </div>
                        </form>
                    </div>
                    <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1599875953199-2b39f58d106a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80')] bg-right bg-no-repeat w-full h-full">
                </div>
                </div>
            </div>
        </>
    );
}