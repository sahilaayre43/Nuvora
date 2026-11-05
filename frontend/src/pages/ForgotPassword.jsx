import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to request a reset link.");
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to request a reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-[#17213d]">Forgot password?</h1>
      <p className="mt-3 text-[#66708a]">Enter your account email. If it is registered, we will send a password reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-orange-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
      {message && <p role="status" className="mt-4 text-green-700">{message}</p>}
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      <Link to="/login" className="mt-6 font-semibold text-orange-600">Return to sign in</Link>
    </main>
  );
};

export default ForgotPassword;
