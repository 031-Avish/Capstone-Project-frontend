import { useState, useEffect, useContext } from 'react';
import AuthContext from '../store/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faDrumstickBite } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";

export function EditCartItemModal({ cartItem, isVegetarian, updateCartItem, setCart, isEditModalOpen, setIsEditModalOpen }) {
    const authContext = useContext(AuthContext);
    const [toppings, setToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [pizzaDetails, setPizzaDetails] = useState(null);
    const [selectedCrust, setSelectedCrust] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [pizzaPrice, setPizzaPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [toppingsResponse, pizzaResponse] = await Promise.all([
                    fetch('https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Topping/all'),
                    fetch(`https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Pizza/${cartItem.pizza.pizzaId}`)
                ]);

                const toppingsData = await toppingsResponse.json();
                const pizzaData = await pizzaResponse.json();

                if (isVegetarian) {
                    setToppings(toppingsData.filter(t => t.isVegetarian));
                } else {
                    setToppings(toppingsData);
                }
                setPizzaDetails(pizzaData);
                setSelectedToppings(cartItem.topping);
                setSelectedCrust(cartItem.crust.crustId);
                setSelectedSize(cartItem.size.sizeId);
                setQuantity(cartItem.quantity);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        
        if (cartItem) {
            fetchData();
        }
    }, [cartItem, isVegetarian]);

    useEffect(() => {
        if (pizzaDetails) {
            calculatePrice();
        }
    }, [pizzaDetails, selectedSize, selectedCrust, selectedToppings]);

    const handleAddTopping = (toppingId) => {
        setSelectedToppings(prevToppings => {
            const toppingIndex = prevToppings.findIndex(t => t.toppingId === toppingId);
            if (toppingIndex !== -1) {
                const updatedToppings = [...prevToppings];
                updatedToppings[toppingIndex].quantity += 1;
                updatedToppings[toppingIndex].name = toppings.find(t => t.toppingId === toppingId).name;
                return updatedToppings;
            } else {
                const topping = toppings.find(t => t.toppingId === toppingId);
                return [...prevToppings, { ...topping, quantity: 1 }];
            }
        });
    };

    const handleIncreaseQuantity = (toppingId) => {
        setSelectedToppings(prevToppings => {
            const updatedToppings = prevToppings.map(t => 
                t.toppingId === toppingId ? { ...t, quantity: t.quantity + 1 } : t
            );
            return updatedToppings;
        });
    };

    const handleDecreaseQuantity = (toppingId) => {
        setSelectedToppings(prevToppings => {
            const updatedToppings = prevToppings
                .map(t => t.toppingId === toppingId ? { ...t, quantity: t.quantity - 1 } : t)
                .filter(t => t.quantity > 0);
            return updatedToppings;
        });
    };

    const handleSave = async () => {
        let data = {};
        if (cartItem.pizza) {
            const toppingIds = {};
            selectedToppings.forEach(topping => {
                toppingIds[topping.toppingId] = topping.quantity;
            });
            data = {
                "userId": authContext.user.Id,
                "cartItemId": cartItem.cartItemId,
                "pizzaId": cartItem.pizza.pizzaId,
                "sizeId": selectedSize,
                "crustId": selectedCrust,
                "quantity": quantity,
                toppingIds
            };
        }
        try {
            const res = await updateCartItem(authContext.token, authContext.user.Id, data);
            authContext.showAlert('Item quantity updated', 'success');
            setCart(res);
        } catch (error) {
            authContext.showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
        }
        // Reset state after saving
        setSelectedToppings([]);
        setIsEditModalOpen(false);
        setPizzaDetails(null);
        setQuantity(1);
        setSelectedCrust(null);
        setSelectedSize(null);
        setPizzaPrice(0);
        setLoading(true);
    };

    const calculatePrice = () => {
        let price = 0;

        if (pizzaDetails) {
            const size = pizzaDetails.sizes.find(s => s.sizeId === selectedSize);
            const crust = pizzaDetails.crusts.find(c => c.crustId === selectedCrust);

            if (size && crust) {
                price += size.sizeMultiplier * pizzaDetails.basePrice;
                price *= crust.priceMultiplier;

                selectedToppings.forEach(topping => {
                    price += topping.price * topping.quantity;
                });
            }
        }
        setPizzaPrice(price.toFixed(2));
    };

    const handleSizeChange = (e) => {
        const sizeId = parseInt(e.target.value);
        setSelectedSize(sizeId);
        if (pizzaDetails?.sizes.find(s => s.sizeId === sizeId)?.sizeName === "Large") {
            setSelectedCrust(1); // Default to crustId 1 for Large size
        }
    };

    const handleCrustChange = (e) => {
        setSelectedCrust(parseInt(e.target.value));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => { setIsEditModalOpen(false); }}
            contentLabel="Edit Modal"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
        >
            <div className="modal-content p-5 rounded shadow-lg bg-white max-w-md w-full">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">Edit {pizzaDetails?.name}</h2>
                    <button onClick={() => { setIsEditModalOpen(false); }} className="text-red-500 text-xl font-bold">&times;</button>
                </div>
                <p>{pizzaDetails?.description}</p>
                <div className="pizza__veg-nonveg flex justify-center items-center mb-3">
                    {pizzaDetails?.isVegetarian ? (
                        <FontAwesomeIcon icon={faLeaf} className="text-green-500 ml-2" title="Vegetarian" />
                    ) : (
                        <FontAwesomeIcon icon={faDrumstickBite} className="text-red-500 ml-2" title="Non-Vegetarian" />
                    )}
                </div>
                <div className="pizza__price flex justify-center items-center text-base mb-3">
                    <span className="mr-1">₹</span>{pizzaPrice}
                </div>
                <div className="flex justify-center items-center">
                    <div className="pizza__size mb-3 px-2">
                        <select onChange={handleSizeChange} value={selectedSize || ''} className="w-full p-2 border rounded">
                            {pizzaDetails?.sizes.map(size => (
                                <option key={size.sizeId} value={size.sizeId}>{size.sizeName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pizza__crust mb-3 px-2">
                        <select 
                            onChange={handleCrustChange} 
                            value={selectedCrust || ''} 
                            className="w-full p-2 border rounded"
                            disabled={selectedSize && pizzaDetails?.sizes.find(s => s.sizeId === selectedSize)?.sizeName === "Large" && selectedCrust !== 1}
                        >
                            {pizzaDetails?.crusts.map(crust => (
                                <option 
                                    key={crust.crustId} 
                                    value={crust.crustId}
                                    disabled={selectedSize && pizzaDetails?.sizes.find(s => s.sizeId === selectedSize)?.sizeName === "Large" && crust.crustId !== 1}
                                >
                                    {crust.crustName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="pizza__toppings mb-3 px-2">
                    {selectedToppings.length > 0 && (
                        <div>
                            <div className="font-bold mb-2">Selected Toppings:</div>
                            <ul>
                                {selectedToppings.map(topping => (
                                    <li key={topping.toppingId} className="flex justify-between items-center mb-2">
                                        <span>{topping.name} - ₹{topping.price}</span>
                                        <div className="flex items-center">
                                            <button onClick={() => handleDecreaseQuantity(topping.toppingId)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                                            <span className="mx-2">{topping.quantity}</span>
                                            <button onClick={() => handleIncreaseQuantity(topping.toppingId)} className="bg-green-500 text-white px-2 py-1 rounded">+</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div>
                        <div className="font-bold mb-2">Add Toppings:</div>
                        <div className="grid grid-cols-2 gap-2">
                            {toppings.map(topping => (
                                <button 
                                    key={topping.toppingId} 
                                    onClick={() => handleAddTopping(topping.toppingId)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {topping.name} - ₹{topping.price}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">Quantity:</span>
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-20 p-2 border rounded"
                        min="1"
                    />
                </div>
                <button 
                    onClick={handleSave} 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
}
