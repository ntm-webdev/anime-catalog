import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  userId: "",
  userName: "",
  login: (token, userId, userName) => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [authenticatedData, setAuthenticatedData] = useState({
    token: null,
    userId: null,
    userName: null,
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      loginHandler(storedData.token, storedData.userId, storedData.userName);
    }
  }, []);

  const loginHandler = (token, userId, userName) => {
    setAuthenticatedData({ token, userId, userName });
    localStorage.setItem("userData", JSON.stringify({ token, userId, userName }));
  };

  const logoutHandler = () => {
    setAuthenticatedData({
      token: null,
      userId: null,
      userName: null,
    });
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!authenticatedData.token,
        token: authenticatedData.token,
        userId: authenticatedData.userId,
        userName: authenticatedData.userName,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
