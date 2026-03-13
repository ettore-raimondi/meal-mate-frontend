import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "sonner";
import Dashboard from "./components/dashboard/Dashboard";
import Landing from "./components/Landing";
import Restaurants from "./components/restaurants/Restaurants";
import Orders from "./components/Orders";
import Runs from "./components/Runs";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/run/:runNumber" element={<Dashboard />} />
        <Route
          path="/dashboard/run/:runNumber/menu-item/:menuItemNumber"
          element={<Dashboard />}
        />
        <Route path="/runs" element={<Runs />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route
          path="/restaurants/:restaurantNumber"
          element={<Restaurants />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
