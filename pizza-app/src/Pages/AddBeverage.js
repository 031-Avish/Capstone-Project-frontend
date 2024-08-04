import React, { useContext, useState } from 'react';
import AuthContext from '../store/auth-context';

const AddBeverage = () => {
    const authContext = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        imageUrl: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = 'Name is required';
        if (!formData.price) tempErrors.price = 'Price is required';
        if (!formData.imageUrl) tempErrors.imageUrl = 'Image file is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('imageUrl', formData.imageUrl);

            try {
                console.log(authContext.token)
                console.log(authContext.user)
                const response = await fetch('https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Beverage/add', {
                    method: 'POST',
                    
                    body: formDataToSend,
                });
                if (!response.ok) {
                    const error = await response.json();
                    console.log(error)
                    throw error;
                }
                const result = await response.json();
                authContext.showAlert('Beverage added successfully', 'success');
                setFormData({
                    name: '',
                    price: '',
                    imageUrl: null,
                });
            } catch (error) {
                authContext.showAlert(error.errorMessage || error.title || 'Something went wrong', 'danger');
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Beverage</h2>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Image File</label>
                    <input
                        type="file"
                        name="imageUrl"
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Beverage
                </button>
            </form>
        </div>
    );
};

export default AddBeverage;
