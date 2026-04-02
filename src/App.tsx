import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login, Signup } from "./features/auth";
import { Toaster } from "sonner";
import { Dashboard } from "./features/dashboard";
import { Landing } from "./features/landing";
import { Restaurants, useRestaurants } from "./features/restaurants";
import { Orders, OrderDetail } from "./features/orders";
import { Runs } from "./features/runs";
import { AppContext } from "./context/AppContext";

function App() {
  const { restaurants } = useRestaurants();

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
