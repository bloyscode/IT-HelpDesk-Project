import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    if (localStorage.getItem("isLoggedIn")) {
        const role = localStorage.getItem("userRole");
        return role === "admin" ? <Navigate to="/dashboard" replace />
            : <Navigate to="/user/dashboard" replace />;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        const users = [
            {
                email: "admin@helpdesk.com",
                password: "admin123",
                role: "admin",
                name: "Admin",
            },
            {
                email: "employee@company.com",
                password: "user123",
                role: "user",
                name: "Employee",
            },
        ];

        const matchedUser = users.find(
            (user) => user.email === email && user.password === password
        );

        // check for accounts stored in localStorage (updated via profile)
        const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
        const storedMatch = storedAccounts.find(acc => acc.email === email && acc.password === password);

        const userToUse = storedMatch || matchedUser;

        if (userToUse) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", userToUse.role);
            localStorage.setItem("userName", userToUse.name);
            localStorage.setItem("userEmail", userToUse.email);

            if (userToUse.role === "admin") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/user/dashboard", { replace: true });
            }
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <h1>Help Desk Pro</h1>
                    <p>Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <a href="#">Forgot Password?</a>
                    </div>

                    <button className="login-btn" type="submit">
                        Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;