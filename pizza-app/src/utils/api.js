const BASE_URL = 'https://localhost:7188/api';
export const loginUser = async (credentials) => {
    try{
        const response = await fetch(`${BASE_URL}/UserLoginRegister/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json(); 
    }
    catch (error) {
        throw error; // Rethrow the error after logging it
    }
};

export const signupUser = async (credentials) => {
    try {
        const response = await fetch(`${BASE_URL}/UserLoginRegister/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        // console.error('Signup error:', error);
        throw error; 
    }
};

export const getMenu = async () => {
    try {
        
        const response = await fetch(`${BASE_URL}/Pizza/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        // console.error('Get menu error:', error);
        throw error; // Rethrow the error after logging it
    }
};

export const addItemToCart = async (userId, pizzaId, sizeId, crustId, quantity, toppings) => {
    try {
        const toppingIds = {};
        toppings.forEach(topping => {
            toppingIds[topping.toppingId] = topping.quantity;
        });

        const response = await fetch(`${BASE_URL}/Cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                pizzaId,
                sizeId,
                crustId,
                quantity,
                toppingIds,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error('Add item to cart error:', error);
        throw error; // Rethrow the error after logging it
    }
};
export const addBeverageToCart = async (token , userId, beverageId, quantity) => {
    try {
        const response = await fetch(`${BASE_URL}/Cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                beverageId,
                quantity,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error('Add item to cart error:', error);
        throw error; // Rethrow the error after logging it
    }
}

export const getCartItems=async(token,userId)=>{
    console.log(token);
    console.log(userId);
    try {
        const response = await fetch(`${BASE_URL}/Cart/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    }
    catch(error){
        throw error;
    }

}

export const getAllBeverages = async () => {
    try {
        const response = await fetch(`${BASE_URL}/Beverage/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Get beverages error:', error);
        throw error;
    }
}


export const deleteCartItem = async (cartItemId) => {
}
export const removeItemFromCart = async (token, userId,cartItemId) => {
    try {
        const response = await fetch(`${BASE_URL}/Cart/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                cartItemId
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    }
    catch(error){
        throw error;
    }

}
export const updateCartItem = async (token, userId,data) => {
    console.log(data);
    try{
        const response = await fetch(`${BASE_URL}/Cart/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                data
            ),
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    }
    catch(error){
        throw error;
    }
}
export const getNewlyAddedPizzas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/Pizza/new`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Get newly added pizzas error:', error);
        throw error;
    }
};
export const getMostSoldPizzas = async () => {};
export const getCheesePizzas = async () => {
    try {
        
        const response = await fetch(`${BASE_URL}/Pizza/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        const pizzas = await response.json();
        console.log(pizzas);
        return pizzas.filter(pizza => pizza.
            description
            .toLowerCase().includes('extra cheese'));
        return 
    } catch (error) {
        // console.error('Get menu error:', error);
        throw error; // Rethrow the error after logging it
    }
};

// Fetch all toppings
export const getToppings = async (isVegetarian = false) => {
    try {
        const response = await fetch('https://localhost:7188/api/Topping/all'); // Adjust the endpoint accordingly
        const data = await response.json();
        if (isVegetarian) {
            return data.filter(t => t.isVegetarian);
        }
        return data;
    } catch (error) {
        console.error("Failed to fetch toppings:", error);
        throw error;
    }
};

// Fetch pizza by id
export const getPizzaById = async (pizzaId) => {
    try {
        const response = await fetch(`${BASE_URL}/Pizza/${pizzaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Get pizza by id error:', error);
        throw error;
    }
};
