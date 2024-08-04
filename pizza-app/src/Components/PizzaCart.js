import { useState,useEffect } from "react";
import { AddToCartButton } from './AddToCartButton';
import { AddToppingsModal } from "./AddToppingModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLeaf, faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
export function PizzaCard(props) {
    const defaultSize = props.item.sizes.find(s => s.sizeId === 1);
    const defaultCrust = props.item.crusts.find(c => c.crustId === 1);
    const [selectedSize, setSelectedSize] = useState(defaultSize);
    const [selectedCrust, setSelectedCrust] = useState(defaultCrust);
    const [isToppingsModalOpen, setToppingsModalOpen] = useState(false);
    const [pizzaPrice , setPizzaPrice] = useState(props.item.basePrice);   
    const [selectedToppings, setSelectedToppings] = useState([]);
    // it calculates the price of the pizza
    const calculatePrice = () => {
        let price = 0;
        
            price += props.item.sizes.find(s => s.sizeId === selectedSize.sizeId).sizeMultiplier * props.item.basePrice;
            price *= props.item.crusts.find(c => c.crustId === selectedCrust.crustId).priceMultiplier;
        
        selectedToppings.forEach(topping => {
            price += topping.price * topping.quantity;
        });
        setPizzaPrice(price.toFixed(2));
    }

    useEffect(() => {
        calculatePrice();
    }, [selectedSize, selectedCrust, selectedToppings]);

    const handleSizeChange = (e) => {
        const size = props.item.sizes.find(s => s.sizeId === parseInt(e.target.value));
        setSelectedSize(size);
        if (size.sizeName === "Large") {
            setSelectedCrust(props.item.crusts.find(c => c.crustId === 1));
        }
        calculatePrice();
    };

    const handleCrustChange = (e) => {
        const crust = props.item.crusts.find(c => c.crustId === parseInt(e.target.value));
        setSelectedCrust(crust);
        
    };

    const openToppingsModal = () => setToppingsModalOpen(true);
    const closeToppingsModal = (toppings) => {
        setSelectedToppings(toppings);
        calculatePrice();
        setToppingsModalOpen(false);
    };

    return (
        <div className="pizza shadow-2xl rounded-3xl m-3 p-2 flex flex-col w-[350px]" >
            <div className="pizza__image p-3 mb-2">
                <img className="h-48 w-full object-cover" src={props.item.image} alt={props.item.name} />
            </div>

            <div className="pizza__name flex justify-center items-center font-bold text-lg text-gray-800 mb-1">
                {props.item.name}
            </div>

            <div className="pizza__description text-center text-sm text-gray-600 mb-3">
                {props.item.description}
            </div>

            <div className="pizza__veg-nonveg flex justify-center items-center mb-3">
                {props.item.isVegetarian ? (
                    <FontAwesomeIcon icon={faLeaf} className="text-green-500 ml-2" title="Vegetarian" />
                ) : (
                    <FontAwesomeIcon icon={faDrumstickBite} className="text-red-500 ml-2" title="Non-Vegetarian" />

                )}
            </div>

            <div className="pizza__price flex justify-center items-center text-base mb-3">
                <span className="mr-1">₹</span>{pizzaPrice}
            </div>
            <div className=" flex justify-center items-center ">

            <div className="pizza__size mb-3 px-2">
                <select onChange={handleSizeChange} value={selectedSize?.sizeId || ''} className="w-full p-2 border rounded">
                    {/* <option value="" disabled>Select Size</option> */}
                    {props.item.sizes.map(size => (
                        <option key={size.sizeId} value={size.sizeId}>{size.sizeName}</option>
                    ))}
                </select>
            </div>

            <div className="pizza__crust mb-3 px-2">
                <select 
                    onChange={handleCrustChange} 
                    value={selectedCrust?.crustId || ''} 
                    className="w-full p-2 border rounded"
                    disabled={selectedSize?.sizeName === "Large" && selectedCrust?.crustId !== 1}
                >
                    {/* <option value="" disabled>Select Crust</option> */}
                    {props.item.crusts.map(crust => (
                        <option 
                            key={crust.crustId} 
                            value={crust.crustId}
                            disabled={selectedSize?.sizeName === "Large" && crust.crustId !== 1}
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
                                <li key={topping.toppingId}>
                                    {topping.name} - {topping.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="pizza__add mb-1 flex justify-between items-center">
                <AddToCartButton 
                    pizzaId={props.item.pizzaId}
                    toppings={selectedToppings}
                    selectedSize={selectedSize}
                    selectedCrust={selectedCrust} 
                    quantity = {1}
                    setSelectedCrust={setSelectedCrust}
                    setSelectedSize={setSelectedSize}
                    setSelectedToppings={setSelectedToppings}
                    defaultCrust={defaultCrust}
                    defaultSize={defaultSize}
                />
                <button onClick={openToppingsModal} className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    {selectedToppings.length > 0 ? "Update Toppings" : "Add Toppings"}
                </button>
            </div>

            {isToppingsModalOpen && (
                <AddToppingsModal 
                    closeModal={closeToppingsModal}
                    pizzaId={props.item.pizzaId}
                    selectedToppings={selectedToppings}
                    isVegetarian={props.item.isVegetarian}
                />
            )}
        </div>
    );
}
