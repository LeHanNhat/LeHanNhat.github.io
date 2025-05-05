import axios from 'axios';


const API_BASE_URL = '/api/discount-codes';


export const createDiscountCode = async (discount) => {
    console.log("discount code: ", discount);   
    
    try {
        const response = await axios.post(API_BASE_URL, discount);
        console.log("create discount code response: ", response.data);
        
        return response.data;
    }
    catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }
}
export const getAllDiscountCode = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        console.log("get all discount code response: ", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }
}
export const updateDiscountCode = async (id, discount) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, discount);
        console.log("update discount code response: ", response.data);
        
        return response.data;
    }
    catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }

}
export const deleteDiscountCode = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        console.log("delete discount code response: ", response);
        return response.status === 204 ? response.status : "";
    }
    catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }

}
export const getDiscountCodeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        console.log("get discount code by id response: ", response.data);
        
        return response.data;
    }
    catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }
}
export const getDiscountCodeByCode = async (code) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/code/${code}`);
        console.log("get discount code by code response: ", response.data);
        
        return response.data;
    }   
    catch (error) {
        console.error("Error creating discount code:", error);
        throw error;
    }
   
}




