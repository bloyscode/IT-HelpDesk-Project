import { FaChartBar, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "./Reports.css";

function Reports() {
    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <p className="page-eyebrow">Analytics</p>
                    <h1>Reports</h1>
                </div>
                <button className="primary-btn">Export Report</button>
            </div>

            <div className="reports-summary">
                <div className="summary-card">
                    <div className="summary-icon blue">
                        <FaChartBar />
                    </div>
                    <div>
                        <h3>156</h3>
                        <p>Total Tickets</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon amber">
                        <FaClock />
                    </div>
                    <div>
                        <h3>18h</h3>
                        <p>Avg. Resolution</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <h3>84%</h3>
                        <p>Solved This Month</p>
                    </div>
                </div>
            </div>

            <div className="reports-grid">
                <section className="report-card">
                    <div className="report-card-header">
                        <h2>Ticket Breakdown</h2>
                        <span className="chip">Weekly</span>
                    </div>

                    <ul className="report-list">
                        <li>
                            <span>Open</span>
                            <strong>12</strong>
                        </li>
                        <li>
                            <span>In Progress</span>
                            <strong>8</strong>
                        </li>
                        <li>
                            <span>Resolved</span>
                            <strong>45</strong>
                        </li>
                    </ul>
                </section>

                <section className="report-card">
                    <div className="report-card-header">
                        <h2>Priority Issues</h2>
                        <span className="chip warning">High</span>
                    </div>

                    <ul className="report-list">
                        <li>
                            <span>High Priority</span>
                            <strong>6</strong>
                        </li>
                        <li>
                            <span>Medium Priority</span>
                            <strong>11</strong>
                        </li>
                        <li>
                            <span>Low Priority</span>
                            <strong>18</strong>
                        </li>
                    </ul>
                </section>

                <section className="report-card wide">
                    <div className="report-card-header">
                        <h2>Recent Activity</h2>
                        <span className="chip">Today</span>
                    </div>

                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Action</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>09:15</td>
                                <td>Ticket #104 updated by agent</td>
                                <td><span className="status-pill success">Resolved</span></td>
                            </tr>
                            <tr>
                                <td>10:40</td>
                                <td>New ticket created by user</td>
                                <td><span className="status-pill warning">Pending</span></td>
                            </tr>
                            <tr>
                                <td>12:05</td>
                                <td>Escalation request received</td>
                                <td><span className="status-pill danger">Critical</span></td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>

            <section className="report-card notice-card">
                <div className="notice-icon">
                    <FaExclamationTriangle />
                </div>
                <div>
                    <h3>Attention needed</h3>
                    <p>3 tickets have been pending for more than 24 hours and should be reviewed.</p>
                </div>
            </section>
        </div>
    );
}

export default Reports;
