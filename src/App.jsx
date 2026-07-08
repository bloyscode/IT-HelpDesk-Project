import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import CreateTicket from "./pages/CreateTicket/CreateTicket";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tickets" element={<Tickets />} />

        <Route
          path="/create-ticket"
          element={<CreateTicket />}
        />
      </Route>

    </Routes>
  );
}

export default App;