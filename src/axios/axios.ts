// src/axiosInstance.ts
import axios, { AxiosInstance } from 'axios';

// Interface for Access Token
interface AccessToken {
  token: string; // Name this based on  cookie structure
}
// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },  withCredentials: true,

});

// Optionally, you can add interceptors for request and response
// axiosInstance.interceptors.request.use(
//   (config) => {
//      // Extract access token from cookies (consider error handling)
//      const accessTokenCookie = document.cookie.split('; ').find((row) =>
//       row.startsWith('access_token=')
//     );

//     if (accessTokenCookie) {
//       const accessToken: AccessToken = {
//         token: accessTokenCookie.split('=')[1],
//       };
//       config.headers.Authorization = `Bearer ${accessToken.token}`;
//     }
   
//     return config;
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );

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
