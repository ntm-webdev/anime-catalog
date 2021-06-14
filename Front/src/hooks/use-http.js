import { useState, useCallback } from "react";
import axios from "axios";

const useHttp = () => {
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [message, setMessage] = useState("");

  const sendRequest = useCallback(
    async (url, method, data = null, extraConfig = null) => {
      let response;
      setSpinner(true);

      try {
        if (method === "get") {
          const res = await axios.get(url, extraConfig);
          response = res.data.fetchedData;
        } else if (method === "delete") {
          const res = await axios.delete(url, extraConfig);
          response = res.data;
        } else {
          const res = await axios.post(url, data, extraConfig);
          response = res.data;
          setMessage(response.msg);
          setTimeout(() => {
            setMessage("");
          }, 1500);
        }
        setError("");
        setSpinner(false);
        return response;
      } catch (err) {
        setSpinner(false);
        setMessage("");
        if (err.response.status === 422) {
          if (err.response.data.errors.length > 0) {
            setErrors(err.response.data.errors);
          } else {
            setError(err.response.data.msg);
          }
        } else if (err.response.status === 500 || err.response.status === 401) {
          setError(err.response.data.msg);
        } else {
          setError(err.response.data.msg);
        }
      }
    },
    []
  );

  return { sendRequest, spinner, message, error, errors };
};

export default useHttp;
