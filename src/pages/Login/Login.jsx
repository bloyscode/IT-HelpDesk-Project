import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    if (localStorage.getItem("isLoggedIn")) {
        return <Navigate to="/dashboard" replace />;
    }
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = (e) => {
        e.preventDefault();

        console.log("Login button clicked");
        console.log(email);
        console.log(password);

        // Temporary credentials
        if (
            email === "admin@helpdesk.com" &&
            password === "admin123"
        ) {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/dashboard", { replace: true });
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <h1>HelpDesk Pro</h1>
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
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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