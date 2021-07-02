import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.common['Content-Type'] = "multipart/form-data";
  }
  return config;
});
