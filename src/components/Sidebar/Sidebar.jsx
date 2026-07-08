import "./Sidebar.css";
import {
    FaTachometerAlt,
    FaTicketAlt,
    FaPlusCircle,
    FaUsers,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/", { replace: true });
    };

    return (
        <aside className="sidebar">
            {/* --- Top Section (Grows to push bottom section down) --- */}
            <div className="sidebar-top">
                <div className="logo">
                    <h1>HelpDeskPro</h1>
                </div>

                <ul className="menu">
                    <li>
                        <NavLink to="/dashboard" className="menu-link">
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tickets" className="menu-link">
                            <FaTicketAlt />
                            <span>Tickets</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/create-ticket" className="menu-link">
                            <FaPlusCircle />
                            <span>Create Ticket</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/users" className="menu-link">
                            <FaUsers />
                            <span>Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports" className="menu-link">
                            <FaChartBar />
                            <span>Reports</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className="menu-link">
                            <FaCog />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* --- Bottom Section (Sticks to the bottom) --- */}
            <div className="sidebar-bottom">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;