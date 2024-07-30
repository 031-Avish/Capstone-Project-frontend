import { useState, useEffect } from 'react';

export function AddToppingsModal({ closeModal, pizzaId,selectedToppings ,isVegetarian }) {
    const [toppings, setToppings] = useState([]);
    const [selected, setSelected] = useState(selectedToppings );

    useEffect(() => {
        async function fetchToppings() {
            try {
                const response = await fetch('https://localhost:7188/api/Topping/all'); // Adjust the endpoint accordingly
                const data = await response.json();
                if (isVegetarian) {
                    setToppings(data.filter(t => t.isVegetarian));
                } else {
                    setToppings(data);
                }
                setToppings(data);
            } catch (error) {
                console.error("Failed to fetch toppings:", error);
            }
        }
        fetchToppings();
    }, []);

    const handleAddTopping = (toppingId) => {
        const toppingIndex = selected.findIndex(t => t.toppingId === toppingId);
        if (toppingIndex !== -1) {
            const updatedToppings = [...selected];
            updatedToppings[toppingIndex].quantity += 1;
            updatedToppings[toppingIndex].name = toppings.find(t => t.toppingId === toppingId).name;
            setSelected(updatedToppings);
        } else {
            const topping = toppings.find(t => t.toppingId === toppingId);
            setSelected([...selected, { ...topping, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (toppingId) => {
        const updatedToppings = selected.map(t => 
            t.toppingId === toppingId ? { ...t, quantity: t.quantity + 1 } : t
        );
        setSelected(updatedToppings);
    };

    const handleDecreaseQuantity = (toppingId) => {
        const updatedToppings = selected
            .map(t => t.toppingId === toppingId ? { ...t, quantity: t.quantity - 1 } : t)
            .filter(t => t.quantity > 0);
        setSelected(updatedToppings);
    };
    

    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content p-5 rounded shadow-lg bg-white max-w-md w-full">
                <h2 className="text-lg font-bold mb-3">Select Toppings</h2>
                <ul className="mb-3">
                    {toppings.map(topping => (
                        <li key={topping.toppingId} className="mb-2 flex justify-between items-center">
                            <span>{topping.name} - ₹{topping.price}</span>
                            {selected.some(t => t.toppingId === topping.toppingId) ? (
                                <div className="flex items-center">
                                    <button onClick={() => handleDecreaseQuantity(topping.toppingId)} className="bg-red-500 text-white px-2 rounded">-</button>
                                    <span className="mx-2">{selected.find(t => t.toppingId === topping.toppingId).quantity}</span>
                                    <button onClick={() => handleIncreaseQuantity(topping.toppingId)} className="bg-green-500 text-white px-2 rounded">+</button>
                                </div>
                            ) : (
                                <button onClick={() => handleAddTopping(topping.toppingId)} className="bg-blue-500 text-white px-2 rounded">Add</button>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end">
                    <button onClick={() => closeModal(selected)} className="bg-blue-500 text-white px-4 py-2 rounded">Done</button>
                </div>
            </div>
        </div>
    );
}