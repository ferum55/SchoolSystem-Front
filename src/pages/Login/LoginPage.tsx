import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/users/login", {
                email,
                password
            });

            const data = response.data;

            // Save token + user info
            localStorage.setItem("name", data.fullName);
localStorage.setItem("email", data.email);
localStorage.setItem("role", data.role);
localStorage.setItem("userId", data.userId);
localStorage.setItem("token", data.token);


            // Redirect by role
            if (data.role === "Teacher") navigate("/teacher");
            else if (data.role === "Student") navigate("/student");
            else if (data.role === "Admin") navigate("/admin");
            else navigate("/");

        } catch (err) {
            alert("Invalid email or password");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: 10, marginBottom: 10 }}
                />

                <button type="submit" style={{ width: "100%", padding: 10 }}>
                    Login
                </button>
            </form>
        </div>
    );
}
