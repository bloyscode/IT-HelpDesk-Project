import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Tickets.css";

function Tickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([
        {
            id: 1001,
            subject: "Printer Offline",
            status: "Open",
            priority: "High",
            date: "Jul 8, 2026",
        },
        {
            id: 1002,
            subject: "Wi-Fi Connection",
            status: "In Progress",
            priority: "Medium",
            date: "Jul 8, 2026",
        },
        {
            id: 1003,
            subject: "Outlook Login Issue",
            status: "Resolved",
            priority: "Low",
            date: "Jul 7, 2026",
        },
    ]);

    useEffect(() => {
        const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
        if (storedTickets.length > 0) {
            setTickets([...tickets, ...storedTickets]);
        }
    }, []);

    return (
        <div className="tickets-page">

            <div className="tickets-header">
                <h1>Tickets</h1>
            </div>

            <div className="ticket-filters">

                <input
                    type="text"
                    placeholder="Search tickets..."
                />

                <select>
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                </select>

                <select>
                    <option>All Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>

            </div>

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td>#{ticket.id}</td>

                            <td>{ticket.subject}</td>

                            <td>
                                <span
                                    className={`status ${ticket.status
                                        .replace(" ", "-")
                                        .toLowerCase()}`}
                                >
                                    {ticket.status}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={`priority ${ticket.priority.toLowerCase()}`}
                                >
                                    {ticket.priority}
                                </span>
                            </td>

                            <td>{ticket.date}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Tickets;