import axios from  'axios';


const API_BASE_URL = '/api/service/orders';


export const getAllOrder =async()=>{
    const response = await axios.get(API_BASE_URL);
    return response.data;
}
export const getOrderById =async(id)=>{
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
}
 
export const changeOrderStatus =async(id,status)=>{
    const response = await axios.put(`${API_BASE_URL}/${id}/${status}`);
    return response.data;
}

