import { jwtDecode } from "jwt-decode";
import {useState, useContext } from "react";
import { Navigate } from "react-router-dom";

export const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token && jwtDecode(token).role === "User") {
    return children;
  }
  return (
    <Navigate
      to={"/"}
      replace={true}
    ></Navigate>
  
  );
};

// export const Public = ({ children }) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return children;
//   }
//   return (
//     <Navigate
//       to={"/"}
//       replace={true}
//     ></Navigate>
//   );
// };

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

    if (token && jwtDecode(token).role === "Admin") {
        
        return children;
    }
    return (
        <Navigate
            to={"/login"}
            replace={true}
        ></Navigate>
        );
};