import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

function CreateTicket() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: "",
        category: "Printer",
        priority: "Low",
        department: "IT",
        assignedTo: "Unassigned",
        description: "",
        attachment: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.subject.trim() || !formData.description.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        const ticketId = Math.floor(Math.random() * 10000) + 1000;
        const newTicket = {
            id: ticketId,
            subject: formData.subject,
            category: formData.category,
            priority: formData.priority,
            department: formData.department,
            assignedTo: formData.assignedTo,
            description: formData.description,
            status: "Open",
            date: new Date().toLocaleDateString(),
        };

        // Store in localStorage
        const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
        existingTickets.push(newTicket);
        localStorage.setItem("tickets", JSON.stringify(existingTickets));

        alert("Ticket created successfully!");
        navigate("/tickets");
    };

    const handleCancel = () => {
        navigate("/tickets");
    };

    return (
        <div className="create-ticket">

            <div className="page-header">

                <h1>Create New Ticket</h1>

                <p>
                    Submit a new support request.
                </p>

            </div>

            <form className="ticket-form" onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>Subject *</label>

                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter ticket subject"
                    />

                </div>

                <div className="row">

                    <div className="form-group">

                        <label>Category *</label>

                        <select name="category" value={formData.category} onChange={handleChange}>

                            <option>Printer</option>
                            <option>Hardware</option>
                            <option>Software</option>
                            <option>Network</option>
                            <option>Email</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Priority *</label>

                        <select name="priority" value={formData.priority} onChange={handleChange}>

                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>

                        </select>

                    </div>

                </div>

                <div className="row">

                    <div className="form-group">

                        <label>Department</label>

                        <select name="department" value={formData.department} onChange={handleChange}>

                            <option>IT</option>
                            <option>HR</option>
                            <option>Finance</option>
                            <option>Marketing</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Assigned To</label>

                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>

                            <option>Unassigned</option>

                        </select>

                    </div>

                </div>

                <div className="form-group">

                    <label>Description *</label>

                    <textarea
                        rows="7"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the issue..."
                    ></textarea>

                </div>

                <div className="form-group">

                    <label>Attachment</label>

                    <input type="file" name="attachment" onChange={handleChange} />

                </div>

                <div className="buttons">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Create Ticket
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateTicket;