import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  userName: "",
  login: (token, username) => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUsername] = useState(null);

  useEffect(() => {
    getJWT();
  }, []);

  const getJWT = async () => {
    const res = await axiosInstance.get('/admin/jwt');
    loginHandler(res.data.token, res.data.userName);
  };

  const loginHandler = async (token, username) => {
    setToken(token);
    setUsername(username);
  };

  const logoutHandler = async () => {
    setToken(null);
    setUsername(null);
    await axiosInstance.get('/logout');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userName: userName,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
