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
export const getToppings = async () => {};
export const addItemToCart = async () => {};
export const getNewlyAddedPizzas = async () => {};
export const getMostSoldPizzas = async () => {};
export const getCheesePizzas = async () => {};

