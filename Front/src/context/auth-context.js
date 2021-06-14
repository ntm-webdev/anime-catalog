import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  userId: "",
  userName: "",
  login: (u_token, u_id, u_name) => {},
  logout: () => {},
});

const AuthProvider = (props) => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      loginHandler(storedData.token, storedData.userId, storedData.userName);
    }
  }, []);

  const loginHandler = (u_token, u_id, u_name) => {
    setToken(u_token);
    setUserId(u_id);
    setUserName(u_name);
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: u_token, userId: u_id, userName: u_name })
    );
  };

  const logoutHandler = () => {
    setToken("");
    setUserId("");
    setUserName("");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
