import axios, { AxiosInstance } from "axios";

export const serverHost = "192.168.0.14";
export const serverPort = 5000;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: `http://${serverHost}/:${serverPort}`,
    timeout: 5000,
    // headers: {'X-Custom-Header': 'foobar'}
});

export default axiosInstance;