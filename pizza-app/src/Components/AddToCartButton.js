import { useState , useContext} from 'react';
import { addItemToCart } from '../utils/api';
import AuthContext from '../store/auth-context';
// add to cart button 
export function AddToCartButton(props) {
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const authContext = useContext(AuthContext);
    // useEffect(() => {

    //     if (isAddedToCart) {
    //         setQuantity(0);
    //         setIsAddedToCart(false);
    //     }
    // }, [isAddedToCart])

    const handleAddToCart = async () => {
        console.log(authContext);
        if(!authContext.isLoggedIn){
            alert('Please login to add item to cart');
            return;
        }
        console.log(props);
        var user = authContext.user;
        try{
            const res = await addItemToCart(user.Id, props.pizzaId,props.selectedSize.sizeId, props.selectedCrust.crustId, props.quantity, props.toppings); 
                authContext.showAlert('Pizza added to cart','success');
                props.setSelectedToppings([]);  
                props.setSelectedCrust(props.defaultCrust);
                props.setSelectedSize(props.defaultSize);
                setIsAddedToCart(true);
            }
            catch(error){
                authContext.showAlert(error.errorMessage || error.title || "Something went wrong",'danger');
                return;
            }
    }

    return (
        <div className="flex justify-around my-3">
            <button className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" onClick={handleAddToCart}>
               
                    Add to Cart
               
            </button>

          
        </div>
    );
}
