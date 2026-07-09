import { FaUserCircle } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";
import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-profile">
          <FaUserCircle size={40} />
        </div>
      </div>
      <div className="cards">

          <StatCard title="Open Tickets" number="12" />
          <StatCard title="In Progress" number="8" />
          <StatCard title="Resolved" number="45" />

        </div>

        <div className="table">

          <h2>Recent Tickets</h2>

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Issue</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td>#101</td>
                <td>Printer Offline</td>
                <td>Open</td>
              </tr>

              <tr>
                <td>#102</td>
                <td>Wi-Fi Connection</td>
                <td>In Progress</td>
              </tr>

              <tr>
                <td>#103</td>
                <td>Email Login</td>
                <td>Resolved</td>
              </tr>

            </tbody>

          </table>

        </div>
    </>
  );
}

export default Dashboard;