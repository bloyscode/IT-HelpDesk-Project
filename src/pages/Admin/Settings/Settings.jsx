import { useEffect, useState } from "react";
import { FaCog, FaBell, FaShieldAlt, FaPalette, FaSave } from "react-icons/fa";
import "./Settings.css";

const defaultSettings = {
    notifications: true,
    emailAlerts: true,
    autoAssign: false,
    darkMode: false,
    language: "English",
    timezone: "UTC",
    twoFactor: false,
};

function Settings() {
    const [settings, setSettings] = useState(defaultSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("adminSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (saved) {
            const timeout = window.setTimeout(() => setSaved(false), 1800);
            return () => window.clearTimeout(timeout);
        }
    }, [saved]);

    const handleToggle = (field) => {
        setSettings((current) => ({ ...current, [field]: !current[field] }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSettings((current) => ({ ...current, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem("adminSettings", JSON.stringify(settings));
        setSaved(true);
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <p className="page-eyebrow">Configuration</p>
                    <h1>Settings</h1>
                </div>
                <button className="primary-btn" onClick={handleSave}>
                    <FaSave />
                    <span>{saved ? "Saved" : "Save Changes"}</span>
                </button>
            </div>

            <div className="settings-grid">
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <h2><FaBell /> Notifications</h2>
                            <p>Control how updates reach your team.</p>
                        </div>
                    </div>

                    <label className="toggle-row">
                        <span>Enable desktop notifications</span>
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={() => handleToggle("notifications")}
                        />
                    </label>

                    <label className="toggle-row">
                        <span>Send email alerts</span>
                        <input
                            type="checkbox"
                            checked={settings.emailAlerts}
                            onChange={() => handleToggle("emailAlerts")}
                        />
                    </label>

                    <label className="toggle-row">
                        <span>Auto-assign incoming tickets</span>
                        <input
                            type="checkbox"
                            checked={settings.autoAssign}
                            onChange={() => handleToggle("autoAssign")}
                        />
                    </label>
                </section>

                <section className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <h2><FaShieldAlt /> Security</h2>
                            <p>Keep team access secure.</p>
                        </div>
                    </div>

                    <label className="toggle-row">
                        <span>Enable two-factor authentication</span>
                        <input
                            type="checkbox"
                            checked={settings.twoFactor}
                            onChange={() => handleToggle("twoFactor")}
                        />
                    </label>

                    <label className="field-row">
                        <span>Password reset window</span>
                        <select name="timezone" value={settings.timezone} onChange={handleChange}>
                            <option value="UTC">UTC</option>
                            <option value="GMT+1">GMT+1</option>
                            <option value="GMT-5">GMT-5</option>
                        </select>
                    </label>
                </section>

                <section className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <h2><FaPalette /> Appearance</h2>
                            <p>Adjust display preferences.</p>
                        </div>
                    </div>

                    <label className="toggle-row">
                        <span>Dark mode</span>
                        <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={() => handleToggle("darkMode")}
                        />
                    </label>

                    <label className="field-row">
                        <span>Language</span>
                        <select name="language" value={settings.language} onChange={handleChange}>
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </label>
                </section>

                <section className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <h2><FaCog /> Workspace</h2>
                            <p>Set default behavior for your help desk.</p>
                        </div>
                    </div>

                    <label className="field-row">
                        <span>Default timezone</span>
                        <select name="timezone" value={settings.timezone} onChange={handleChange}>
                            <option value="UTC">UTC</option>
                            <option value="GMT+1">GMT+1</option>
                            <option value="GMT-5">GMT-5</option>
                        </select>
                    </label>

                    <div className="settings-note">
                        <strong>Tip:</strong> Changes are stored locally for now and can be reused after refresh.
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Settings;
