"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Client sends credentials to local proxy route which sets HttpOnly cookie
  const loginRoute = '/api/auth/login';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // send to local next.js API route which will set HttpOnly cookie
      const res = await fetch(loginRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setMsg(`Login failed: ${res.status} ${txt}`);
        setLoading(false);
        return;
      }

      setMsg('Login successful — redirecting to dashboard...');
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: unknown) {
      setMsg(`Request error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function checkProfile() {
    setMsg(null);
    try {
      // call local proxy which will read the HttpOnly cookie and forward the token
      const res = await fetch('/api/auth/profile');
      if (!res.ok) {
        const txt = await res.text();
        setMsg(`Profile failed: ${res.status} ${txt}`);
        return;
      }
      const data = await res.json();
      setMsg(`Profile OK: ${JSON.stringify(data)}`);
    } catch (err: unknown) {
      setMsg(`Request error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 480, margin: "2rem auto" }}>
      <h1>Admin Login</h1>
      <form onSubmit={submit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <button onClick={checkProfile} style={{ padding: "8px 16px" }}>
          Check /auth/profile
        </button>
      </div>

      {msg && (
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{msg}</pre>
      )}

      <p style={{ marginTop: 24, fontSize: 12, color: "#666" }}>
        Note: This example stores the JWT in localStorage for simplicity. For
        production, prefer using HttpOnly cookies or a secure session.
      </p>
    </main>
  );
}
