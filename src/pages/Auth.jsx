import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async function handleSignup() {
    await supabase.auth.signUp({
      email,
      password
    });
  }

  return (
    <div className="auth-page">
      <h2>Login / Register</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}