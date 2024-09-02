// src/axiosInstance.ts
import axios, { AxiosInstance } from 'axios';

// Interface for Access Token
interface AccessToken {
  token: string; // Name this based on  cookie structure
}
console.log(process.env.apiBaseUrl)
// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_apiBaseUrl, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },  withCredentials: true,

});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response) {
      // Handle known error responses (like 401, 404, etc.)
      console.error('Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
