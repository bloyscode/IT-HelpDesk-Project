import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUserShield } from "react-icons/fa";
import "./Users.css";

const starterUsers = [
    {
        id: 1,
        name: "Alicia Gomez",
        email: "alicia.gomez@company.com",
        role: "Admin",
        status: "Active",
        lastActive: "2 mins ago",
    },
    {
        id: 2,
        name: "Marcus Lee",
        email: "marcus.lee@company.com",
        role: "Agent",
        status: "Active",
        lastActive: "14 mins ago",
    },
    {
        id: 3,
        name: "Nadia Brooks",
        email: "nadia.brooks@company.com",
        role: "User",
        status: "Pending",
        lastActive: "1 day ago",
    },
    {
        id: 4,
        name: "Daniel Carter",
        email: "daniel.carter@company.com",
        role: "Agent",
        status: "Inactive",
        lastActive: "3 days ago",
    },
    {
        id: 5,
        name: "Sofia Patel",
        email: "sofia.patel@company.com",
        role: "User",
        status: "Active",
        lastActive: "1 hour ago",
    },
];

const emptyForm = {
    id: null,
    name: "",
    email: "",
    role: "User",
    status: "Active",
};

function Users() {
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [users, setUsers] = useState(() => {
        if (typeof window === "undefined") {
            return starterUsers;
        }

        const savedUsers = window.localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : starterUsers;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        window.localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = `${user.name} ${user.email}`
                .toLowerCase()
                .includes(query.toLowerCase());
            const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
            const matchesStatus =
                statusFilter === "All Status" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [query, roleFilter, statusFilter, users]);

    const activeCount = users.filter((user) => user.status === "Active").length;
    const adminCount = users.filter((user) => user.role === "Admin").length;

    const openCreateModal = () => {
        setForm(emptyForm);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setForm({ ...user });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm(emptyForm);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim()) {
            return;
        }

        const normalizedUser = {
            id: form.id ?? Date.now(),
            name: form.name.trim(),
            email: form.email.trim(),
            role: form.role,
            status: form.status,
            lastActive: form.id ? "Just now" : "Just added",
        };

        if (form.id) {
            setUsers((currentUsers) =>
                currentUsers.map((user) => (user.id === form.id ? normalizedUser : user))
            );
        } else {
            setUsers((currentUsers) => [normalizedUser, ...currentUsers]);
        }

        closeModal();
    };

    const handleDelete = (userId) => {
        const confirmed = window.confirm("Delete this user?");
        if (!confirmed) {
            return;
        }

        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    };

    return (
        <div className="users-page">
            <div className="users-header">
                <div>
                    <p className="page-eyebrow">Administration</p>
                    <h1>Users</h1>
                </div>

                <button className="primary-btn" onClick={openCreateModal}>
                    <FaPlus />
                    <span>Add User</span>
                </button>
            </div>

            <div className="users-summary">
                <div className="summary-card">
                    <div className="summary-icon blue">
                        <FaUserShield />
                    </div>
                    <div>
                        <h3>{users.length}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <FaUserShield />
                    </div>
                    <div>
                        <h3>{activeCount}</h3>
                        <p>Active Accounts</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon amber">
                        <FaUserShield />
                    </div>
                    <div>
                        <h3>{adminCount}</h3>
                        <p>Admins</p>
                    </div>
                </div>
            </div>

            <div className="users-toolbar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>

                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Agent</option>
                    <option>User</option>
                </select>

                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                </select>
            </div>

            <div className="users-card">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar">
                                                {user.name
                                                    .split(" ")
                                                    .map((part) => part[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>
                                            <div>
                                                <strong>{user.name}</strong>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.lastActive}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-btn"
                                                aria-label={`Edit ${user.name}`}
                                                onClick={() => openEditModal(user)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-btn danger"
                                                aria-label={`Delete ${user.name}`}
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No users found for the current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{form.id ? "Edit User" : "Add User"}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form className="user-form" onSubmit={handleSubmit}>
                            <label>
                                Full Name
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                                    placeholder="Enter full name"
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                                    placeholder="Enter email"
                                    required
                                />
                            </label>

                            <label>
                                Role
                                <select
                                    value={form.role}
                                    onChange={(event) => setForm({ ...form, role: event.target.value })}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Agent">Agent</option>
                                    <option value="User">User</option>
                                </select>
                            </label>

                            <label>
                                Status
                                <select
                                    value={form.status}
                                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </label>

                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn">
                                    {form.id ? "Save Changes" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
