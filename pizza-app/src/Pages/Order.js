import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../store/auth-context';
import Loading from '../Components/Loading';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authContext = useContext(AuthContext);

    const fetchOrders = async () => {
        try {
            if (!authContext.token || !authContext.user) return;

            const response = await fetch(`https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Order/user/${authContext.user.Id}`);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            const data = await response.json();
            data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError('No orders found');
            setLoading(false);
            authContext.showAlert(error.errorMessage || error.title || "Something went wrong", 'danger');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [authContext.token, authContext.user]);

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
        if (!confirmCancel) return;

        try {
            const response = await fetch(`https://localhost:7188/api/Order/cancel/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // Fetch updated orders after cancellation
            fetchOrders();
            authContext.showAlert('Order canceled successfully !! Refund will be made in 3 days', 'success');
        } catch (err) {
            setError('Failed to cancel order');
        }
    };

    

    return (

        <div className='order-page min-h-screen p-5' >
            {loading && <Loading/>}
            {! loading && 
            <div>
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-center">You have no orders.</p>
            ) : (
                <div className="order-list grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-card p-4 border rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Order ID: {order.orderId}</h2>
                            <p className="text-sm text-gray-600 mb-2">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            <div className="order-items mb-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.orderItemId} className="order-item mb-4 border-b border-gray-200 pb-2">
                                        {item.pizza &&
                                            <h3 className="font-semibold">{item.pizza.name}</h3>
                                        }
                                        {item.crust &&
                                            <p>{item.crust.crustName} | {item.size.sizeName}</p>
                                        }
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₹{item.price}</p>
                                        {item.pizza &&
                                            <p className="text-sm text-gray-500">{item.pizza.description}</p>
                                        }
                                        {item.topping.length > 0 && (
                                            <div className="toppings mt-2">
                                                <h4 className="font-medium">Toppings:</h4>
                                                <ul className="list-disc pl-5">
                                                    {item.topping.map(topping => (
                                                        <li key={topping.orderToppingId}>
                                                            {topping.name} (x{topping.quantity}) - ₹{topping.price}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {item.beverage && (
                                            <div className="beverage mt-2">
                                                <h4 className="font-medium">Beverage:</h4>
                                                <p>{item.beverage.name} - ₹{item.beverage.price}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="order-status mb-4">
                                <p className={`status-text ${order.orderStatus.toLowerCase()}`}>
                                    {order.orderStatus === 'Success' ? (
                                        'Your order is preparing'
                                    ) : order.orderStatus === 'Completed' ? (
                                        'Order completed'
                                    ) : order.orderStatus === 'Canceled' ? (
                                        'You canceled the order'
                                    ) : order.orderStatus === 'Prepared' ? ('Your Order is Prepared'):(
                                        'Order failed'
                                    )}
                                </p>
                            </div>
                            {order.orderStatus === 'Success' && (
                                <button
                                    onClick={() => handleCancelOrder(order.orderId)}
                                    className="cancel-button bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            </div>
}
        </div>
    );
};

export default Order;
