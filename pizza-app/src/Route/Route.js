import {useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
export const UserRoute = ({ children }) => {
  const context = useContext(AuthContext);
  if (!context.isLoggedIn &&  context.user.role != "User") {
    return (
      <Navigate
        to={"/"}
        replace={true}
      ></Navigate>
    
    );
  }
  return children;
};

export const Public = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return children;
  }
  return (
    <Navigate
      to={"/"}
      replace={true}
    ></Navigate>
  );
};

export const AdminRoute = ({ children }) => {
  const context = useContext(AuthContext);
    if (!context.isLoggedIn &&  context.user.role != "Admin") {
        return (
        <Navigate
            to={"/"}
            replace={true}
        ></Navigate>
        );
    }
    return children;
};