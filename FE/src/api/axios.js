import axios from 'axios';


const api = axios.create({
  // Base URL pointing to our MERN Backend API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',


  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(

  (response) => response,


  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );


        return api(originalRequest);
      } catch (refreshError) {

        console.error('Session expired. User must log in again.', refreshError);


        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-logout'));
        }

        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);

export default api;
