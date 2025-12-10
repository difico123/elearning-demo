import React, { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getUserProfile } from "../../redux/actions/auth.action";
import { useSelector, useDispatch } from "react-redux";
import { getJwt } from "../../service/AdminService";

const ProtectedRoute = ({ children }) => {
  const store = useSelector((state) => state.store.auth);

  return !!getJwt() ? children : <Navigate to="/admin/login" />;
};

const ProtectedInstructorRoute = ({ role, children }) => {
  return role === 1 ? children : <Navigate to="/" />;
};

const ProtectedUserRoute = ({ role, children }) => {
  return role === 0 ? children : <Navigate to="/" />;
};

export { ProtectedRoute, ProtectedInstructorRoute, ProtectedUserRoute };
