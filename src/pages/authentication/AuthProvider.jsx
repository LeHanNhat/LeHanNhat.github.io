import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const username = localStorage.getItem("username");
    console.log("username",username);
    if (username) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  const login = (username,role) => {
    console.log("Logged in as:", username);
    localStorage.setItem("username", username); 
    localStorage.setItem("role", role); 
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("cart"); // Clear additional data if needed
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthContext);
};
