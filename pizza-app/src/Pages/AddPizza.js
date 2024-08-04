import React, { useContext, useState } from 'react';
import AuthContext from '../store/auth-context';

const AddPizza = () => {
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    ImageUrl: null,
    isVegetarian: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.description) tempErrors.description = 'Description is required';
    if (!formData.basePrice) tempErrors.basePrice = 'Base price is required';
    if (!formData.ImageUrl) tempErrors.imageFile = 'Image file is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validate()) {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('basePrice', formData.basePrice);
      formDataToSend.append('imageUrl', formData.ImageUrl);
      formDataToSend.append('isVegetarian', formData.isVegetarian);
      
      try {
        const response = await fetch('https://pizzaapp-hte6azhwd7fth9b0.westus2-01.azurewebsites.net/api/Pizza/add', {
          method: 'POST',
          body: formDataToSend,
        });
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        const result = await response.json();
        authContext.showAlert('Pizza added successfully', 'success');
        setFormData({
            name: '',
            description: '',
            basePrice: '',
            ImageUrl: null,
            isVegetarian: false,
          });
          setLoading(false);
      } catch (error) {
        setLoading(false);
        authContext.showAlert(error.errorMessage || error.title || 'Something went wrong', 'danger');
      }
    }
    setLoading(false);  
  };

  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Pizza</h2>
      <form enctype="multipart/form-data" onSubmit={handleSubmit}>
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
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image File</label>
          <input
            type="file"
            name="ImageUrl"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.ImageUrl && <p className="text-red-500 text-sm mt-1">{errors.ImageUrl}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Is Vegetarian</label>
          <input
            type="checkbox"
            name="isVegetarian"
            checked={formData.isVegetarian}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Pizza
        </button>
      </form>
    </div>
  );
};

export default AddPizza;
