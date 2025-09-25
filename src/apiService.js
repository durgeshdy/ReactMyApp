import axios from 'axios';
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const getItems = () => axios.get(API_URL);
export const getItem = (id) => axios.get(`${API_URL}/${id}`);
export const createItem = (data) => axios.post(API_URL, data);
export const updateItem = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteItem = (id) => axios.delete(`${API_URL}/${id}`);

