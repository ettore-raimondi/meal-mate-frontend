import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login, Signup } from "./features/auth";
import { Toaster } from "sonner";
import { Dashboard } from "./features/dashboard";
import { Landing } from "./features/landing";
import { Restaurants } from "./features/restaurants";
import { Orders, OrderDetail } from "./features/orders";
import { Runs } from "./features/runs";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/place-order" element={<Dashboard />} />
        <Route path="/place-order/run/:runNumber" element={<Dashboard />} />
        <Route
          path="/place-order/run/:runNumber/menu-item/:menuItemNumber"
          element={<Dashboard />}
        />
        <Route path="/runs" element={<Runs />} />
        <Route path="/runs/:runId" element={<Runs />} />
        <Route path="/my-order-history" element={<Orders />} />
        <Route path="/my-order-history/:orderId" element={<OrderDetail />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
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
