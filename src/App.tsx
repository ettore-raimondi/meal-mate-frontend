import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "sonner";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Restaurants from "./components/Restaurants";
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
        <Route path="/home" element={<Home />} />
        <Route path="/home/run/:runNumber" element={<Home />} />
        <Route
          path="/home/run/:runNumber/menu-item/:menuItemNumber"
          element={<Home />}
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
