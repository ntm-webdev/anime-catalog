import { useState, useCallback } from "react";

import { axiosInstance } from "../lib/axios";

const useHttp = () => {
  const [errors, setErrors] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [message, setMessage] = useState({ msg: '', success: true });

  const sendRequest = useCallback(async (url, method, data = null) => {
    setErrors([]);
    setMessage({ msg: '', success: true });
    setSpinner(true);

    let response;
    let res;
    try {
      switch (method) {
        case "get":
          res = await axiosInstance.get(url, data);
          response = res.data.fetchedData;
          break;
        case "delete":
          res = await axiosInstance.delete(url, data);
          response = res.data;
          break;
        default:
          res = await axiosInstance.post(url, data);
          response = res.data;
          setMessage({ msg: response.msg, success: true });
          setTimeout(() => setMessage(""), 1500);
      }
      setSpinner(false);
      return response;
    } catch (err) {
      setSpinner(false);
      if (err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setMessage({msg: err.response.data.msg, success: false});
      }
    }
  }, []);

  return { sendRequest, spinner, message, errors };
};

export default useHttp;
