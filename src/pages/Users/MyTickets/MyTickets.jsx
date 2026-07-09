import { useEffect, useMemo, useState } from "react";
import "./MyTickets.css";
import { useNavigate } from "react-router-dom";

const pageSize = 6;
const priorityRank = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
};

function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [page, setPage] = useState(1);

  const currentUserEmail = localStorage.getItem("userEmail") || "";
  const currentUserName = localStorage.getItem("userName") || "User";
  const currentRole = localStorage.getItem("userRole") || "user";

  useEffect(() => {
    const loadTickets = () => {
      try {
        setLoading(true);
        const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");

        const visibleTickets = storedTickets.filter((ticket) => {
          if (currentRole === "admin") {
            return false;
          }

          return (
            ticket.createdByEmail === currentUserEmail ||
            ticket.createdBy === currentUserName ||
            !ticket.createdByEmail
          );
        });

        setTickets(visibleTickets);
      } catch (itemError) {
        setError("Unable to load your tickets right now.");
        console.error(itemError);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [currentRole, currentUserEmail, currentUserName]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, dateFilter, sortOrder]);

  const visibleTickets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = tickets.filter((ticket) => {
      const searchText = `${ticket.id} ${ticket.subject}`.toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;
      const matchesDate = !dateFilter || (ticket.createdAt || ticket.date || "").includes(dateFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
    });

    const sorted = [...filtered].sort((first, second) => {
      const firstDate = new Date(first.createdAt || first.date || "1970-01-01");
      const secondDate = new Date(second.createdAt || second.date || "1970-01-01");

      switch (sortOrder) {
        case "oldest":
          return firstDate - secondDate;
        case "highest-priority":
          return (priorityRank[second.priority] || 0) - (priorityRank[first.priority] || 0);
        case "lowest-priority":
          return (priorityRank[first.priority] || 0) - (priorityRank[second.priority] || 0);
        case "newest":
        default:
          return secondDate - firstDate;
      }
    });

    return sorted;
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter, dateFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(visibleTickets.length / pageSize));
  const pagedTickets = visibleTickets.slice((page - 1) * pageSize, page * pageSize);

  const summary = useMemo(() => {
    const counts = {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "Open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "In Progress").length,
      resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
      closed: tickets.filter((ticket) => ticket.status === "Closed").length,
    };

    return counts;
  }, [tickets]);

  const openDetails = (ticket) => {
    setSelectedTicket(ticket);
    setDraft({
      subject: ticket.subject || "",
      category: ticket.category || "Hardware",
      priority: ticket.priority || "Medium",
      description: ticket.description || "",
    });
    setCommentInput("");
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setDraft({});
    setCommentInput("");
    setIsEditing(false);
  };

  const updateStoredTickets = (updatedTicket) => {
    setTickets((currentTickets) => {
      const updatedTickets = currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      );

      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      return updatedTickets;
    });
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!selectedTicket) {
      return;
    }

    const nextTicket = {
      ...selectedTicket,
      subject: draft.subject.trim() || selectedTicket.subject,
      category: draft.category,
      priority: draft.priority,
      description: draft.description.trim() || selectedTicket.description,
      lastUpdated: new Date().toLocaleString(),
      timeline: [
        ...(selectedTicket.timeline || []),
        {
          id: Date.now(),
          title: "Ticket updated",
          description: `Updated by ${currentUserName}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    updateStoredTickets(nextTicket);
    setSelectedTicket(nextTicket);
    setIsEditing(false);
  };

  const handleCancelTicket = (ticketToCancel = selectedTicket) => {
    if (!ticketToCancel || ticketToCancel.status !== "Open") {
      return;
    }

    const nextTicket = {
      ...ticketToCancel,
      status: "Cancelled",
      lastUpdated: new Date().toLocaleString(),
      timeline: [
        ...(ticketToCancel.timeline || []),
        {
          id: Date.now(),
          title: "Ticket cancelled",
          description: `Cancelled by ${currentUserName}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    updateStoredTickets(nextTicket);
    setSelectedTicket(nextTicket);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    if (!selectedTicket || !commentInput.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      author: currentUserName,
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextTicket = {
      ...selectedTicket,
      comments: [...(selectedTicket.comments || []), newComment],
      timeline: [
        ...(selectedTicket.timeline || []),
        {
          id: Date.now() + 1,
          title: "Comment added",
          description: `${currentUserName} replied to the request`,
          createdAt: new Date().toISOString(),
        },
      ],
      lastUpdated: new Date().toLocaleString(),
    };

    updateStoredTickets(nextTicket);
    setSelectedTicket(nextTicket);
    setCommentInput("");
  };

  const handleAttachmentUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file || !selectedTicket) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextAttachment = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        url: reader.result,
      };

      const nextTicket = {
        ...selectedTicket,
        attachments: [...(selectedTicket.attachments || []), nextAttachment],
        timeline: [
          ...(selectedTicket.timeline || []),
          {
            id: Date.now() + 2,
            title: "Attachment uploaded",
            description: `${file.name} was attached to this ticket`,
            createdAt: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toLocaleString(),
      };

      updateStoredTickets(nextTicket);
      setSelectedTicket(nextTicket);
    };

    reader.readAsDataURL(file);
  };

  const downloadAttachment = (attachment) => {
    if (!attachment.url) {
      return;
    }

    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name || "attachment";
    link.click();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "status-pill open";
      case "In Progress":
        return "status-pill progress";
      case "Resolved":
        return "status-pill resolved";
      case "Closed":
        return "status-pill closed";
      case "Cancelled":
        return "status-pill cancelled";
      default:
        return "status-pill";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
      case "Urgent":
        return "priority-pill high";
      case "Medium":
        return "priority-pill medium";
      default:
        return "priority-pill low";
    }
  };

  return (
    <div className="user-my-tickets">
      <div className="page-shell">
        <div className="page-header-row">
          <div>
            <p className="eyebrow">Service Desk</p>
            <h2>My Tickets</h2>
            <p className="page-subtitle">Track the requests you submitted and keep the conversation moving with IT.</p>
          </div>

          <button className="primary-btn" onClick={() => navigate("/user/create-ticket")}>+ Create Ticket</button>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Tickets</span>
            <strong>{summary.total}</strong>
          </div>
          <div className="summary-card">
            <span>Open</span>
            <strong>{summary.open}</strong>
          </div>
          <div className="summary-card">
            <span>In Progress</span>
            <strong>{summary.inProgress}</strong>
          </div>
          <div className="summary-card">
            <span>Resolved</span>
            <strong>{summary.resolved}</strong>
          </div>
          <div className="summary-card">
            <span>Closed</span>
            <strong>{summary.closed}</strong>
          </div>
        </div>

        <div className="filters-card">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              value={searchTerm}
              placeholder="Ticket ID or subject"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="All">All</option>
              <option value="Printer">Printer</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </div>

          <div className="filter-group">
            <label>Sort</label>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest-priority">Highest Priority</option>
              <option value="lowest-priority">Lowest Priority</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="state-card">Loading your tickets...</div>
        ) : error ? (
          <div className="state-card error-state">{error}</div>
        ) : visibleTickets.length === 0 ? (
          <div className="state-card">
            <h3>No tickets found</h3>
            <p>Try a different filter or create a new request.</p>
          </div>
        ) : (
          <>
            <div className="table-card">
              <div className="table-wrapper">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned Technician</th>
                      <th>Date Created</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>
                          <div className="subject-cell">
                            <strong>{ticket.subject}</strong>
                            <span>{ticket.description?.slice(0, 70) || "No summary available"}</span>
                          </div>
                        </td>
                        <td>{ticket.category}</td>
                        <td><span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span></td>
                        <td><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
                        <td>{ticket.assignedTo || "Unassigned"}</td>
                        <td>{ticket.date || ticket.createdAt?.slice(0, 10)}</td>
                        <td>{ticket.lastUpdated || ticket.date || "—"}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="secondary-btn" onClick={() => openDetails(ticket)}>View</button>
                            <button
                              className="secondary-btn"
                              onClick={() => {
                                if (ticket.status === "Open") {
                                  openDetails(ticket);
                                  setIsEditing(true);
                                }
                              }}
                              disabled={ticket.status !== "Open"}
                            >
                              Edit
                            </button>
                            <button
                              className="danger-btn"
                              onClick={() => handleCancelTicket(ticket)}
                              disabled={ticket.status !== "Open"}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pagination-row">
              <span>Showing {visibleTickets.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, visibleTickets.length)} of {visibleTickets.length}</span>
              <div className="pagination-actions">
                <button className="secondary-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                  Previous
                </button>
                <button className="secondary-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedTicket && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">Ticket #{selectedTicket.id}</p>
                <h3>{selectedTicket.subject}</h3>
              </div>
              <button className="icon-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-content">
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Category</span>
                  <strong>{selectedTicket.category}</strong>
                </div>
                <div className="detail-item">
                  <span>Priority</span>
                  <strong><span className={getPriorityClass(selectedTicket.priority)}>{selectedTicket.priority}</span></strong>
                </div>
                <div className="detail-item">
                  <span>Status</span>
                  <strong><span className={getStatusClass(selectedTicket.status)}>{selectedTicket.status}</span></strong>
                </div>
                <div className="detail-item">
                  <span>Assigned Technician</span>
                  <strong>{selectedTicket.assignedTo || "Unassigned"}</strong>
                </div>
              </div>

              <div className="modal-section">
                <h4>Request details</h4>
                {isEditing ? (
                  <form className="edit-form" onSubmit={handleSaveEdit}>
                    <label>Subject
                      <input value={draft.subject || ""} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} />
                    </label>
                    <div className="double-fields">
                      <label>Category
                        <select value={draft.category || "Hardware"} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                          <option value="Printer">Printer</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Software">Software</option>
                          <option value="Network">Network</option>
                          <option value="Email">Email</option>
                        </select>
                      </label>
                      <label>Priority
                        <select value={draft.priority || "Medium"} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </label>
                    </div>
                    <label>Description
                      <textarea rows="4" value={draft.description || ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
                    </label>
                    <div className="modal-actions">
                      <button className="secondary-btn" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="primary-btn" type="submit">Save Changes</button>
                    </div>
                  </form>
                ) : (
                  <p>{selectedTicket.description || "No additional details provided."}</p>
                )}
              </div>

              <div className="modal-section">
                <div className="section-top">
                  <h4>Attachments</h4>
                  <label className="upload-btn">
                    Upload
                    <input type="file" onChange={handleAttachmentUpload} />
                  </label>
                </div>
                {(selectedTicket.attachments || []).length === 0 ? (
                  <p className="muted-text">No attachments yet.</p>
                ) : (
                  <ul className="attachment-list">
                    {(selectedTicket.attachments || []).map((attachment) => (
                      <li key={attachment.id}>
                        <span>{attachment.name}</span>
                        <button className="secondary-btn" onClick={() => downloadAttachment(attachment)}>Download</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="modal-section">
                <div className="section-top">
                  <h4>Comments</h4>
                  {selectedTicket.status === "Open" && (
                    <button className="secondary-btn" onClick={() => setIsEditing(true)}>Edit ticket</button>
                  )}
                </div>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    rows="3"
                    value={commentInput}
                    placeholder="Share a status update with IT"
                    onChange={(event) => setCommentInput(event.target.value)}
                  />
                  <button className="primary-btn" type="submit">Add Comment</button>
                </form>
                {(selectedTicket.comments || []).length === 0 ? (
                  <p className="muted-text">No comments yet.</p>
                ) : (
                  <div className="comment-list">
                    {(selectedTicket.comments || []).map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-head">
                          <strong>{comment.author}</strong>
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-section">
                <h4>Activity timeline</h4>
                <div className="timeline-list">
                  {(selectedTicket.timeline || []).map((entry) => (
                    <div key={entry.id} className="timeline-item">
                      <div className="timeline-marker" />
                      <div>
                        <strong>{entry.title}</strong>
                        <p>{entry.description}</p>
                        <span>{new Date(entry.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTickets;
