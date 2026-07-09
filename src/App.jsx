import { Routes, Route } from "react-router-dom";

import Login from "./pages/Admin/Login/Login";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Tickets from "./pages/Admin/Tickets/Tickets";
import CreateTicket from "./pages/Admin/CreateTicket/CreateTicket";
import Users from "./pages/Admin/Users/Users";
import Reports from "./pages/Admin/Reports/Reports";
import Settings from "./pages/Admin/Settings/Settings";
import UserDashboard from "./pages/Users/Dashboard/UserDashboard";
import CreateTicketUser from "./pages/Users/CreateTicket/CreateTicket";
import MyTickets from "./pages/Users/MyTickets/MyTickets";
import Profile from "./pages/Users/Profile/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      {/* user pages are children of MainLayout so they share the same sidebar/layout */}

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

        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/create-ticket" element={<CreateTicketUser />} />
        <Route path="/user/my-tickets" element={<MyTickets />} />
        <Route path="/user/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}

export default App;