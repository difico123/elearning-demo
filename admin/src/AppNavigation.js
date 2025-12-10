import { ProtectedRoute } from "./components/protected.route/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AuthRouter from "./routes/Auth";
import DashBoard from "./routes/Dashboard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "./redux/actions";
import showToast from "./components/common/toast.js";
import Toast from "./components/common/toast.jsx";
import { setNotification } from "./redux/actions/app.action";

function AppNavigation() {
  const dispatch = useDispatch();
  const [toastList, setToastList] = useState([]);
  const store = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  useEffect(() => {
    let { type, title, description } = store.app.notification;

    if (title) {
      setToastList([showToast(type, title, description)]);
    }
  }, [store.app.notification]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/*" element={<AuthRouter />} />
        </Routes>
      </Router>
      <Toast toastList={toastList} />
    </div>
  );
}

export default AppNavigation;
