import axios, { AxiosInstance } from "axios";


const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 5000,
    // headers: {'X-Custom-Header': 'foobar'}
});

export default axiosInstance;