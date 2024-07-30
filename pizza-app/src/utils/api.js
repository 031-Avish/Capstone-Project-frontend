const BASE_URL = 'https://localhost:7188/api';
export const loginUser = async (credentials) => {
    try{
        const response = await fetch(`${BASE_URL}/UseroginRegister/Login`, {
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
            throw new Error(error.message || 'Failed to sign up');
        }

        return await response.json();
    } catch (error) {
        console.error('Signup error:', error);
        throw error; // Rethrow the error after logging it
    }
};
