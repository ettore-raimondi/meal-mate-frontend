import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "sonner";
import Dashboard from "./pages/dashboard/Dashboard";
import Landing from "./pages/Landing";
import Restaurants from "./pages/restaurants/Restaurants";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Runs from "./pages/run/Runs";
import { AppContext } from "./context/AppContext";
import { useRestaurants } from "./hooks/useRestaurants";

function App() {
  const restaurants = useRestaurants();

  return (
    <>
      <AppContext.Provider
        value={{
          restaurants,
        }}
      >
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
          <Route path="/runs/:runId" element={<Runs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route
            path="/restaurants/:restaurantNumber"
            element={<Restaurants />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
