import React from 'react';
import axios from 'axios';

const BASE_URL = "/api/service/products"

export const getProductByPage = async (page, size) => {
    try {
        const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`)
        if (response.status === 200) {
            return {
                data: response.data.content || [],
                totalPages: response.data.totalPages || 0 ,
            };
        } else {
            console.error(`Unexpected status code: ${response.status}`);
            return {
                data: [],
                totalPages: 0
            };
        }
    } catch (error) {
        console.log(error);
    }
}


