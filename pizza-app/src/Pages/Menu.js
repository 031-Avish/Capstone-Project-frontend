import { useEffect, useContext, useState } from "react";
import AuthContext from "../store/auth-context";
import { getMenu, getNewlyAddedPizzas, getMostSoldPizzas, getCheesePizzas,getVegPizza } from '../utils/api';
import { PizzaCard } from "../Components/PizzaCart";
import Loading from "../Components/Loading";

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);
    const { showAlert } = useContext(AuthContext);

    const fetchMenu = async (fetchFunction) => {
        try {
            setLoading(true);
            const response = await fetchFunction();
            console.log(response);
            setMenuItems(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
        }
    };

    useEffect(() => {
        fetchMenu(getMenu);
    }, []);

    return (
        <>
        {loading && <Loading />}
        {!loading && (
        <div className="min-h-screen menu p-5" style={{ background: '#e7ecef' }}>
            
            <div className="menu__options flex justify-center mb-5">
                <button 
                    onClick={() => fetchMenu(getMenu)}
                    className="mx-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    All
                </button>
                <button 
                    onClick={() => fetchMenu(getNewlyAddedPizzas)}
                    className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Newly Added
                </button>
                <button 
                    onClick={() => fetchMenu(getMostSoldPizzas)}
                    className="mx-2 bg-orange-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                >
                    Most Sold
                </button>
                <button 
                    onClick={() => fetchMenu(getCheesePizzas)}
                    className="mx-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                >
                    Cheese Pizzas
                </button>
                <button 
                    onClick={() => fetchMenu(getVegPizza)}
                    className="mx-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                >
                    Veg Pizzas
                </button>
            </div>
            <div className="menu__title text-4xl font-light mb-5 text-center">
                <span className="font-medium">Most Featured </span> Pizzas
            </div>
            <div className="menu__list flex flex-wrap justify-center">
                {menuItems.map(item => (
                    <PizzaCard key={item.pizzaId} item={item}  />
                ))}
            </div>
        </div>
        )}
        </>
    );
}
