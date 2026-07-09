import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Profile() {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("userEmail") || "";
  const [name, setName] = useState(localStorage.getItem("userName") || "Employee");
  const [role, setRole] = useState(localStorage.getItem("userRole") || "user");
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState(storedEmail || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("userName") || "Employee");
    setRole(localStorage.getItem("userRole") || "user");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/", { replace: true });
  };

  const saveName = () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }
    localStorage.setItem("userName", name);
    // also update stored accounts name if present
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const idx = accounts.findIndex(a => a.email === storedEmail);
    if (idx !== -1) {
      accounts[idx].name = name;
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
    setMessage("Name updated.");
  };

  const saveEmail = () => {
    const newEmail = (email || "").trim();
    if (!newEmail) {
      setMessage("Email cannot be empty.");
      return;
    }

    // check uniqueness
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const conflict = accounts.find(a => a.email === newEmail && a.email !== storedEmail);
    if (conflict) {
      setMessage("That email is already in use.");
      return;
    }

    // need current password to authorize email change
    if (!currentPassword) {
      setMessage("Enter current password to change email.");
      return;
    }

    const idx = accounts.findIndex(a => a.email === storedEmail);
    if (idx !== -1) {
      if (accounts[idx].password !== currentPassword) {
        setMessage("Current password is incorrect.");
        return;
      }
      accounts[idx].email = newEmail;
      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("userEmail", newEmail);
      setMessage("Email updated.");
      return;
    }

    // if no stored account, check defaults
    const defaultAccounts = [
      { email: "admin@helpdesk.com", password: "admin123", role: "admin", name: "Admin" },
      { email: "employee@company.com", password: "user123", role: "user", name: "Employee" },
    ];
    const def = defaultAccounts.find(a => a.email === storedEmail && a.password === currentPassword);
    if (!def) {
      setMessage("Current password is incorrect.");
      return;
    }

    // create stored account entry with new email
    const newAcc = { email: newEmail, password: currentPassword, role: def.role, name };
    accounts.push(newAcc);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("userEmail", newEmail);
    setMessage("Email updated and saved.");
  };
  // Consolidated save handler for name, email and password
  const saveAll = () => {
    setMessage("");

    const newEmail = (email || "").trim();
    const wantEmailChange = newEmail && newEmail !== storedEmail;
    const wantPasswordChange = !!newPassword;

    // basic validation
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }
    if (wantPasswordChange && newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    // email uniqueness check
    if (wantEmailChange) {
      const conflict = accounts.find(a => a.email === newEmail && a.email !== storedEmail);
      if (conflict) {
        setMessage("That email is already in use.");
        return;
      }
    }

    const needAuth = wantEmailChange || wantPasswordChange;
    if (needAuth && !currentPassword) {
      setMessage("Enter current password to change email or password.");
      return;
    }

    const idx = accounts.findIndex(a => a.email === storedEmail);

    if (idx !== -1) {
      // existing stored account — verify current password when required
      if (needAuth && accounts[idx].password !== currentPassword) {
        setMessage("Current password is incorrect.");
        return;
      }

      // apply updates
      accounts[idx].name = name;
      if (wantEmailChange) {
        accounts[idx].email = newEmail;
        localStorage.setItem("userEmail", newEmail);
      }
      if (wantPasswordChange) {
        accounts[idx].password = newPassword;
      }

      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("userName", name);
      setMessage("Changes saved.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    // no stored account — validate against default demo accounts when auth is required
    const defaultAccounts = [
      { email: "admin@helpdesk.com", password: "admin123", role: "admin", name: "Admin" },
      { email: "employee@company.com", password: "user123", role: "user", name: "Employee" },
    ];

    if (needAuth) {
      const def = defaultAccounts.find(a => a.email === storedEmail && a.password === currentPassword);
      if (!def) {
        setMessage("Current password is incorrect.");
        return;
      }

      // create new stored account with requested changes
      const accountEmail = wantEmailChange ? newEmail : storedEmail;
      const accountPassword = wantPasswordChange ? newPassword : currentPassword;
      const newAcc = { email: accountEmail, password: accountPassword, role: def.role, name };
      accounts.push(newAcc);
      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("userName", name);
      if (wantEmailChange) localStorage.setItem("userEmail", newEmail);
      setMessage("Changes saved.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    // nothing required auth for — just save name
    localStorage.setItem("userName", name);
    setMessage("Name saved.");
  };

  return (
    <div className="user-profile panel">
      <h2>Profile</h2>
      <p><strong>Username:</strong> {localStorage.getItem("userName") || name}</p>
      <p><strong>Role:</strong> {role}</p>

      <div className="profile-section">
        <h3>Account settings</h3>

        <label>Display name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        

        <hr style={{ margin: '12px 0' }} />

        <label>Email (used to login)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Current password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

        

        <label>New password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <label>Confirm new password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <div className="btn-row">
          <button onClick={saveAll}>Save changes</button>
        </div>

        {message && <p className="profile-message">{message}</p>}
      </div>

      {/* <div style={{ marginTop: 12 }}>
        <button onClick={handleLogout}>Logout</button>
      </div> */}
    </div>
  );
}

export default Profile;
