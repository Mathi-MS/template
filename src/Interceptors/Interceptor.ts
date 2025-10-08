import  Cookies  from 'js-cookie';
import axios from "axios";
import config from "../Config/Config";


axios.defaults.timeout = 25000;
let setIsLoading: (isLoading: boolean) => void = () => {};
let setTimeOutModal: (isTimeOut: boolean) => void = () => {};
let logoutCallback: () => void = () => {};

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const setLoaderCallback = (callback: (isLoading: boolean) => void) => {
  setIsLoading = callback;
};

export const setTimeoutModalCallback = (
  callback: (isTimeOut: boolean) => void
) => {
  setTimeOutModal = callback;
};

const api = axios.create({
  baseURL: config.BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    setIsLoading(true);
    return config;
  },
  (error) => {
    setIsLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    setIsLoading(false);
    return response;
  },
  (error) => {
    setIsLoading(false);
    if (error.code === "ECONNABORTED") {
      setTimeOutModal(true);
    }
    if(error?.response?.status === 401){
       logoutCallback();
      window.location.hash = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
