import { useEffect, useContext,useState } from "react";
import AuthContext from "../store/auth-context";
import {getMenu} from '../utils/api';
import PizzaCard from "../Components/PizzaCard";

export default function Menu() {

    const [menuItems, setMenuItems] = useState([]);
    const authContext = useContext(AuthContext);
    const {showAlert} = useContext(AuthContext);
    useEffect(()=>{
        async function fetchMenu(){
            try{
                const response = await getMenu();
                setMenuItems(response);
            }
            catch(error){
                showAlert(error.errorMessage || error.title || "Something went wrong",'danger');
            }
        }
        fetchMenu();
    },[])

    return (
        <>
            <div className="menu p-5">
            <div className="menu__title text-4xl font-light mb-10">
                    <span className="font-medium">Featured</span> Pizzas
                </div>
                <div className="menu__list grid grid-cols-1 md:grid-cols-4 my-5 p-3">
                    {
                        menuItems.map(item => {
                            return <PizzaCard key = {item._id} item={item} token={authCtx.token} />
                        })
                    }
                </div>
            </div>
            

        </>
    );
}