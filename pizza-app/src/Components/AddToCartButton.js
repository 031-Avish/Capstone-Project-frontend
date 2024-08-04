import { useState , useContext} from 'react';
import { addItemToCart } from '../utils/api';
import AuthContext from '../store/auth-context';
import Spinner from './Spinner';
// add to cart button 
export function AddToCartButton(props) {
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const handleAddToCart = async () => {
        // console.log(authContext);
        if(!authContext.isLoggedIn){
            alert('Please login to add item to cart');
            return;
        }
        setLoading(true);
        // console.log(props);
        var user = authContext.user;
        try{
            const res = await addItemToCart(user.Id, props.pizzaId,props.selectedSize.sizeId, props.selectedCrust.crustId, props.quantity, props.toppings); 
                authContext.showAlert('Pizza added to cart','success');
                props.setSelectedToppings([]);  
                props.setSelectedCrust(props.defaultCrust);
                props.setSelectedSize(props.defaultSize);
                setIsAddedToCart(true);
                setLoading(false);
            }
            catch(error){
                authContext.showAlert(error.errorMessage || error.title || "Something went wrong",'danger');
                setLoading(false);
                return;
            }
    }

    return (
        <div className="flex justify-around my-3">
            { !loading ? (
            <button className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" onClick={handleAddToCart}>
                    Add to Cart  
            </button>
            ) : (
            <Spinner/>
            )}
        </div>
    );
}
