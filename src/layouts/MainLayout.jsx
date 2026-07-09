import { Outlet } from "react-router-dom";
import "../pages/Admin/Dashboard/Dashboard.css";
import "../components/Sidebar/Sidebar.css";

import Sidebar from "../components/Sidebar/Sidebar";


function MainLayout() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;