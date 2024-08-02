import { useState, useEffect } from 'react';

export function EditCartItemModal({ closeModal, cartItem, isVegetarian }) {
    const [toppings, setToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState(cartItem.topping);
    const [crusts, setCrusts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedCrust, setSelectedCrust] = useState(cartItem.crust.crustId);
    const [selectedSize, setSelectedSize] = useState(cartItem.size.sizeId);
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [pizzaDetails, setPizzaDetails] = useState(cartItem.pizza);

    useEffect(() => {
        async function fetchData() {
            try {
                const [toppingsResponse, crustsResponse, sizesResponse] = await Promise.all([
                    fetch('https://localhost:7188/api/Topping/all'),
                    fetch('https://localhost:7188/api/Crust/all'),
                    fetch('https://localhost:7188/api/Size/all')
                ]);

                const toppingsData = await toppingsResponse.json();
                const crustsData = await crustsResponse.json();
                const sizesData = await sizesResponse.json();

                if (isVegetarian) {
                    setToppings(toppingsData.filter(t => t.isVegetarian));
                } else {
                    setToppings(toppingsData);
                }
                setCrusts(crustsData);
                setSizes(sizesData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, [isVegetarian]);

    const handleAddTopping = (toppingId) => {
        const toppingIndex = selectedToppings.findIndex(t => t.toppingId === toppingId);
        if (toppingIndex !== -1) {
            const updatedToppings = [...selectedToppings];
            updatedToppings[toppingIndex].quantity += 1;
            updatedToppings[toppingIndex].name = toppings.find(t => t.toppingId === toppingId).name;
            setSelectedToppings(updatedToppings);
        } else {
            const topping = toppings.find(t => t.toppingId === toppingId);
            setSelectedToppings([...selectedToppings, { ...topping, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (toppingId) => {
        const updatedToppings = selectedToppings.map(t => 
            t.toppingId === toppingId ? { ...t, quantity: t.quantity + 1 } : t
        );
        setSelectedToppings(updatedToppings);
    };

    const handleDecreaseQuantity = (toppingId) => {
        const updatedToppings = selectedToppings
            .map(t => t.toppingId === toppingId ? { ...t, quantity: t.quantity - 1 } : t)
            .filter(t => t.quantity > 0);
        setSelectedToppings(updatedToppings);
    };

    const handleSave = () => {
        const updatedCartItem = {
            ...cartItem,
            quantity,
            crust: crusts.find(c => c.crustId === selectedCrust),
            size: sizes.find(s => s.sizeId === selectedSize),
            topping: selectedToppings
        };
        closeModal(updatedCartItem);
    };

    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content p-5 rounded shadow-lg bg-white max-w-md w-full">
                <h2 className="text-lg font-bold mb-3">Edit {pizzaDetails.name}</h2>
                <p>{pizzaDetails.description}</p>
                <div className="mb-3">
                    <label className="block mb-1">Select Crust</label>
                    <select value={selectedCrust} onChange={(e) => setSelectedCrust(Number(e.target.value))} className="w-full p-2 border rounded">
                        {crusts.map(crust => (
                            <option key={crust.crustId} value={crust.crustId}>{crust.crustName} - Multiplier: {crust.priceMultiplier}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Select Size</label>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(Number(e.target.value))} className="w-full p-2 border rounded">
                        {sizes.map(size => (
                            <option key={size.sizeId} value={size.sizeId}>{size.sizeName} - Multiplier: {size.sizeMultiplier}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Quantity</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Select Toppings</h3>
                    <ul className="mb-3">
                        {toppings.map(topping => (
                            <li key={topping.toppingId} className="mb-2 flex justify-between items-center">
                                <span>{topping.name} - ₹{topping.price}</span>
                                {selectedToppings.some(t => t.toppingId === topping.toppingId) ? (
                                    <div className="flex items-center">
                                        <button onClick={() => handleDecreaseQuantity(topping.toppingId)} className="bg-red-500 text-white px-2 rounded">-</button>
                                        <span className="mx-2">{selectedToppings.find(t => t.toppingId === topping.toppingId).quantity}</span>
                                        <button onClick={() => handleIncreaseQuantity(topping.toppingId)} className="bg-green-500 text-white px-2 rounded">+</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleAddTopping(topping.toppingId)} className="bg-blue-500 text-white px-2 rounded">Add</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
