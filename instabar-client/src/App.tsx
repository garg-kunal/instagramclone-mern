import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register.tsx";
import Home from "./pages/home";
import { fetcher } from "./services/fetcher.ts";
import { userLoggedIn } from "./store/slices/auth.slice.ts";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./adhocs/protectedRouter.tsx";
import Account from "./pages/account";
import eventBus, { Events } from "./services/eventBus.service.ts";
import Requests from "./pages/requests";
import Users from "./pages/users";

function App() {
  const dispatch = useDispatch();

  const fetchUserProfile = () => {
    fetcher(`/user/verify`, "GET")
      .then((res: any) => {
        const add = {
          token: localStorage.getItem("loginauth"),
          isAuthenticated: true,
          user: res.data.data,
        };
        dispatch(userLoggedIn(add));
      })
      .catch(() => {
        localStorage.removeItem("loginauth");
        const add = {
          token: null,
          isAuthenticated: false,
          user: {},
        };
        dispatch(userLoggedIn(add));
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    eventBus.on(Events.PROFILE_UPDATED, fetchUserProfile);
    return () => {
      eventBus.off(Events.PROFILE_UPDATED, fetchUserProfile);
    };
  }, []);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
