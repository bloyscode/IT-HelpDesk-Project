import { FaUserCircle } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";
import "../../Admin/Dashboard/Dashboard.css";

function UserDashboard() {
  const userName = localStorage.getItem("userName") || "Employee";

  const tickets = [
    { id: "#201", subject: "Printer setup", status: "Open" },
    { id: "#202", subject: "VPN access", status: "In Progress" },
    { id: "#203", subject: "Email issue", status: "Resolved" },
  ];

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>User Dashboard</h1>
          <p>Welcome back, {userName} — here are your recent requests.</p>
        </div>
      </div>

      <div className="cards">
        <StatCard title="Open Tickets" number="2" />
        <StatCard title="In Progress" number="1" />
        <StatCard title="Resolved" number="3" />
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
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.subject}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserDashboard;
