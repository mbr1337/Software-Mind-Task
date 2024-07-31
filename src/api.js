import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const saveFormData = async (data) => {
    const response = await axios.post(`${API_URL}/form`, data);
    console.log('saveFormData', response.data)
    return response.data;
};

export const getFormData = async () => {
    const response = await axios.get(`${API_URL}/form`);
    console.log('getFormData', response.data)
    return response.data;
};

export const getContinents = async () => {
    const response = await axios.get(`${API_URL}/continents`);
    console.log('GetContinents', response.data)
    return response.data;
};

export const deleteUserData = async (id) => {
    const response = await axios.delete(`${API_URL}/form/${id}`);
    console.log('deleteUserData', response.data)
    return response.data;
};

export const deleteAllUsersData = async () => {
    const response = await axios.delete(`${API_URL}/form`);
    console.log('deleteAllUsersData', response.data)
    return response.data;
};

export const getSingleFormData = async (id) => {
    const response = await axios.get(`${API_URL}/form/${id}`);
    console.log('getSingleFormData', response.data)
    return response.data;
}