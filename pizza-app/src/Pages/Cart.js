import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../store/auth-context";
import { getCartItems, removeItemFromCart, getAllBeverages,addBeverageToCart ,updateCartItem} from "../utils/api";
import { EditCartItemModal } from "../Components/EditCartItemModal";
import { displayRazorpay } from "../Components/razorpay";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faEdit, faMinus, faTrashAlt, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";



const storeCity = "Indore"; // Replace with your store's city

function Pay(props) {
    const handleOrderPlacement = async () => {
        if (props.isDeliveryValid) {
            console.log(props);
            props.setIsCheckoutModalOpen(false);
            displayRazorpay(props);
        } else {
            alert("Please fill in all required fields correctly.");
        }
    }
    return (
        <button 
            onClick={handleOrderPlacement} 
            className={`bg-lime-300 hover:bg-lime-400 text-lime-800 shadow-md text-white hover:-translate-y-1 transition flex justify-center items-center w-40 py-2 md:mr-10 rounded-md ${!props.isDeliveryValid ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={!props.isDeliveryValid}
        >
            <div className="text-xl font-bold flex items-center justify-center mx-2">
                Pay ₹
            </div>
            <div className="font-bold text-xl">
                {props.orderPrice}
            </div>
        </button>
    );
}

function DeleteButton(props) {
    const handleDelete = async (e) => {
        e.preventDefault();
        props.deleteItem(props.item._id);
    }

    return (
        <button onClick={handleDelete} className="pizza__delete">
            <div className="text-red-500 hover:-translate-y-1 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            </div>
        </button>
    );
}

function DeliveryOptions({ onDeliveryChange, isDeliveryValid ,setIsPickup, setAddress}) {
    const [deliveryType, setDeliveryType] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [area, setArea] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState(storeCity);

    const handleDeliveryTypeChange = (e) => {
        setDeliveryType(e.target.value);
        if (e.target.value === "pickup") {
            const combinedAddress = null;
            setAddress("");
            setIsPickup(true);
            onDeliveryChange(true);
        } else {
            setIsPickup(false);
            onDeliveryChange(false);
        }
    };

    const handleAddressChange = () => {
        const isValid = houseNumber.trim() !== "" && area.trim() !== "" && landmark.trim() !== "" && city === storeCity;
        if (isValid) {
            const combinedAddress = `${houseNumber}, ${area}, ${landmark}, ${city}`;
            setAddress(combinedAddress);
    
        }
        onDeliveryChange(isValid);
    };

    useEffect(() => {
        handleAddressChange();
    }, [houseNumber, area, landmark, city]);

    return (
        <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">Delivery or Pickup:</label>
            <div className="mb-4">
                <input 
                    type="radio" 
                    id="pickup" 
                    name="deliveryOption" 
                    value="pickup" 
                    onChange={handleDeliveryTypeChange} 
                />
                <label htmlFor="pickup" className="ml-2">Store Pickup</label>
            </div>
            <div className="mb-4">
                <input 
                    type="radio" 
                    id="delivery" 
                    name="deliveryOption" 
                    value="delivery" 
                    onChange={handleDeliveryTypeChange} 
                />
                <label htmlFor="delivery" className="ml-2">Delivery</label>
            </div>
            {deliveryType === "delivery" && (
                <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">House Number:</label>
                    <input
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${houseNumber.trim() === "" ? "border-red-500" : "border-green-500"}`}
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                    />
                    <label className="block mt-4 mb-2 text-sm font-bold text-gray-700">Area:</label>
                    <input
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${area.trim() === "" ? "border-red-500" : "border-green-500"}`}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    />
                    <label className="block mt-4 mb-2 text-sm font-bold text-gray-700">Landmark:</label>
                    <input
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${landmark.trim() === "" ? "border-red-500" : "border-green-500"}`}
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                    />
                    <label className="block mt-4 mb-2 text-sm font-bold text-gray-700">City:</label>
                    <input
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${city !== storeCity ? "border-red-500" : "border-green-500"}`}
                        value={city}
                        readOnly
                    />
                </div>
            )}
        </div>
    );
}

function Cart() {
    const [cart, setCart] = useState({ cartItems: [], total: 0, cartId: "" });
    const authContext = useContext(AuthContext);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isItemDeleted, setIsItemDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCartItem, setSelectedCartItem] = useState(null);
    const [isDeliveryValid, setIsDeliveryValid] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [isPickup, setIsPickup] = useState(false);
    const [beverages, setBeverages] = useState([]);
    const [scrollIndex, setScrollIndex] = useState(0);

    const navigate = useNavigate();
    async function fetchCartItems() {
        if (!authContext.token || !authContext.user) return;

        try {
            const res = await getCartItems(authContext.token, authContext.user.Id);
            console.log(res);
            setCart(res);
            setIsItemDeleted(false);
            setLoading(false);
        } catch (error) {
            setError(error.errorMessage || error.title || "Something went wrong");
            setLoading(false);
        }
    }

    async function fetchBeverages() {
        try {
            const res = await getAllBeverages();
            setBeverages(res);
        } catch (error) {
            console.error("Failed to fetch beverages:", error);
        }
    }

    useEffect(() => {
        fetchCartItems();
        fetchBeverages();
    }, [authContext.token, authContext.user, isOrderPlaced, isItemDeleted]);

    const deleteItem = async (id) => {
        // Show confirmation prompt to the user
        const confirmDelete = window.confirm("Are you sure you want to delete this item from your cart?");
        
        if (confirmDelete) {
            try {
                // Proceed with item removal if confirmed
                const res = await removeItemFromCart(authContext.token, authContext.user.Id, id);
                authContext.showAlert('Item removed from cart', 'success');
                setCart(res);
            } catch (error) {
                authContext.showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
            }
        }
    };

    const handleEdit = (item) => {
        setSelectedCartItem(item);
        setIsEditModalOpen(true);
    };

    const handleSave = (updatedItem) => {
        setCart(prevCart => ({
            ...prevCart,
            cartItems: prevCart.cartItems.map(item =>
                item.cartItemId === updatedItem.cartItemId ? updatedItem : item
            )
        }));
        setIsEditModalOpen(false);
    };

    const handleDeliveryChange = (isValid) => {
        setIsDeliveryValid(isValid);
    };

    const openCheckoutModal = () => {
        setIsCheckoutModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setIsCheckoutModalOpen(false);
    };
    const addBeverageToCartHandler = async (beverageId) => {
        // Implement the function to add the selected beverage to the cart.
        try {
            const response = await addBeverageToCart(authContext.token, authContext.user.Id, beverageId, 1);
            authContext.showAlert('Beverage added to cart', 'success');
            setCart(response);
        }
        catch (error) {
            authContext.showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
        }
    };
    const handelQuantityChange = async (item, quantity) => {
        console.log(item);
        let data = {};
        if(item.pizza){
            console.log("going in pizza")
        const toppingIds = {};
        item?.topping.forEach(topping => {
            toppingIds[topping.toppingId] = topping.quantity;
        });
            data = {
            "userId": authContext.user.Id,
            "cartItemId": item.cartItemId,
            "pizzaId": item.pizza.pizzaId,
            "sizeId": item.size.sizeId,
            "crustId": item.crust.crustId,
            "quantity": quantity,
            toppingIds
        };

        }
        else if(item.beverage){
            console.log("going in beverage")
        data ={
            "userId": authContext.user.Id,
            "cartItemId": item.cartItemId,
            "beverageId": item.beverage.beverageId,
            "quantity": quantity
        }
    }
        try{
            const res = await updateCartItem(authContext.token, authContext.user.Id,data);
            authContext.showAlert('Item quantity updated', 'success');
            setCart(res);
        }
        catch(error){
            authContext.showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
        }
    }

    const handleScrollLeft = () => {
        if (scrollIndex > 0) {
            setScrollIndex(scrollIndex - 1);
        }
    };

    const handleScrollRight = () => {
        if (scrollIndex < beverages.length - 1) {
            setScrollIndex(scrollIndex + 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
         <section className=" min-h-screen  py-24 relative bg-gray-100">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
                <h2 className="font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">Shopping Cart</h2>
                {cart.cartItems.length > 0 ? (
                    <>
                        <div className="space-y-4 mb-8">
                            {cart.cartItems.map(item => (
                                <div key={item.cartItemId} className="rounded-3xl border-2 border-gray-200 p-4 lg:p-8 grid grid-cols-12 gap-y-4 mb-4 bg-white shadow-lg">
                                    <div className="col-span-12 lg:col-span-2">
                                        <img src={item?.pizza?.imageUrl} alt={item?.pizza?.name} className="w-full lg:w-[180px] rounded-lg object-cover" />
                                    </div>
                                    <div className="col-span-12 lg:col-span-10 flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-4">
                                            {item.pizza && <h5 className="font-manrope font-bold text-2xl leading-9 text-gray-900">
                                                {item?.pizza?.name} <span className="ml-2 font-light">({item?.crust?.crustName}, {item?.size?.sizeName})</span>
                                            </h5>
                                            }
                                            { item.beverage &&
                                            <h5 className="font-manrope font-bold text-2xl leading-9 text-gray-900">
                                                {item?.beverage?.name}
                                                </h5>
                                                }
                                            <div className="flex items-center">
                                                <button onClick={() => handleEdit(item)} className="rounded-full flex items-center justify-center focus:outline-none mr-2">
                                                    <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-600" />
                                                </button>
                                                <button onClick={() => deleteItem(item.cartItemId)} className="rounded-full flex items-center justify-center focus:outline-none">
                                                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-normal text-base leading-7 text-gray-500 mb-6">
                                            {item?.topping.map(t => (
                                                <span key={t.orderToppingId}>{t.name} ({t.quantity}) </span>
                                            ))}
                                           
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => item.quantity > 1 && handelQuantityChange(item, item.quantity-1)} className="group rounded-full border border-gray-200 p-2.5 bg-white transition-all duration-500 hover:bg-gray-50 focus:outline-none">
                                                    <FontAwesomeIcon icon={faMinus} className="text-gray-900 group-hover:text-black" />
                                                </button>
                                                <input type="text" className="border border-gray-200 rounded-full w-10 text-gray-900 font-semibold text-sm py-1.5 px-3 bg-gray-100 text-center" value={item.quantity} readOnly />
                                                <button onClick={() => handelQuantityChange(item, item.quantity+1)} className="group rounded-full border border-gray-200 p-2.5 bg-white transition-all duration-500 hover:bg-gray-50 focus:outline-none">
                                                    <FontAwesomeIcon icon={faPlus} className="text-gray-900 group-hover:text-black" />
                                                </button>
                                            </div>
                                            <h6 className="text-indigo-600 font-manrope font-bold text-2xl leading-9 text-right">
                                                ₹{item.price}.00
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedCartItem && (
                            <EditCartItemModal
                                cartItem={selectedCartItem}
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                onSave={handleSave}
                            />
                        )}
                        <div className="flex flex-col md:flex-row items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto">
                            <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">Subtotal</h5>
                            <div className="flex items-center justify-between gap-5">
                                <h6 className="font-manrope font-bold text-3xl text-indigo-600">₹{cart.cartItems.reduce((acc, item) => acc + item.price, 0)}</h6>
                            </div>
                        </div>
                        <hr className="w-full border border-gray-200" />
                            <h2 className=" mt-4 font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black mb-4">People also like to add </h2>
                        <div className="flex items-center justify-center mt-8 mb-8">
                            
                            <button onClick={handleScrollLeft} className="p-2 bg-gray-300 rounded-full hover:bg-gray-400">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="flex overflow-x-auto space-x-4 ml-4">
                                {beverages.slice(scrollIndex, scrollIndex + 5).map(beverage => (
                                    <div key={beverage.beverageId} className="bg-white shadow-lg rounded-lg p-4">
                                        <img src={beverage.image} alt={beverage.name} className="w-24 h-24 object-cover rounded" />
                                        <div className="font-bold text-sm mt-2">{beverage.name}</div>
                                        <div className="text-sm mt-1">₹{beverage.price}</div>
                                        <button onClick={() => addBeverageToCartHandler(beverage.beverageId)} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleScrollRight} className="p-2 bg-gray-300 rounded-full hover:bg-gray-400">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                        <div className="flex flex-col items-center mt-6">
                           
                            <button onClick={openCheckoutModal} className="rounded-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-indigo-700">
                                Checkout
                            </button>
                        </div>
                        
                    </>
                ) : (
                    <div className="text-3xl font-light text-center min-h-[400px] flex items-center justify-center">
                        <span className="font-medium mr-2">No items in the cart</span>
                    </div>
                )}
            </div>
        </section> 
            <Modal
                isOpen={isCheckoutModalOpen}
                onRequestClose={closeCheckoutModal}
                contentLabel="Checkout Modal"
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
                >
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                    <button
                    onClick={closeCheckoutModal}
                    className="absolute top-4 right-4 text-xl font-bold"
                    >
                    ×
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Choose Delivery Option</h2>
                    <DeliveryOptions onDeliveryChange={handleDeliveryChange} isDeliveryValid={isDeliveryValid}  setIsPickup={setIsPickup} setAddress={setAddress} />
                    <div className="mt-5">
                    <Pay
                        setIsCheckoutModalOpen={setIsCheckoutModalOpen}
                        token={authContext.token}
                        user={authContext.user}
                        setIsOrderPlaced={setIsOrderPlaced}
                        cartId={cart.cartId}
                        orderPrice={cart.total}
                        isPickup={isPickup}
                        address={address}
                        isDeliveryValid={isDeliveryValid}
                        navigate={navigate}
                    />
                    </div>
                </div>
                </Modal>

       
        </>
    )
}

export default Cart;

