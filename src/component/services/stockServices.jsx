import axios from "axios";

const API_URL = "/api/stocks";

export const getAllStocks = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response);
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.log(error);
    }
}
export const getAllStocksByProduct = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/product/${id}`);
        console.log(response);
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.log(error);
    }
}
export const addStock = (stock) => {
    return axios.post(`${API_URL}`, stock);
}

export const editStock = async(id,quantity) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/quantity/${quantity}`);
        if (response) {
            console.log("update stock",response.status);
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
 
}
export const deleteStock = async(id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`,{});
        if (response) {
            console.log("delete stock",response.status);
            return response;
        }
    } catch (error) {
        console.log(error);
    }
 
}