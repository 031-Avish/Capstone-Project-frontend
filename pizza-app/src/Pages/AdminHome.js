import React, { useState } from 'react';
import AddPizza from './AddPizza';
import ViewOrders from './ViewOrders';
import AddBeverage from './AddBeverage';

export default function AdminHome() {
    const [activeComponent, setActiveComponent] = useState(null);

    const handleButtonClick = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className="min-h-screen admin-home p-5" style={{ background: '#e7ecef' }}>
            <div className="admin-home__options flex justify-center mb-5">
                <button
                    onClick={() => handleButtonClick('addPizza')}
                    className="mx-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                    Add Pizza
                </button>
                <button
                    onClick={() => handleButtonClick('addBeverages')}
                    className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Add Beverages
                </button>
                <button
                    onClick={() => handleButtonClick('viewOrders')}
                    className="mx-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                >
                    View Orders
                </button>
            </div>
            <div className="admin-home__content">
                {activeComponent === 'addPizza' && <AddPizza />}
                {activeComponent === 'addBeverages' && <AddBeverage />}
                {activeComponent === 'viewOrders' && <ViewOrders />}
            </div>
        </div>
    );
}
