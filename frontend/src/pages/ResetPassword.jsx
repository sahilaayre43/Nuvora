import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("This reset link is missing its token. Request another reset link.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to reset your password.");
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-[#17213d]">Choose a new password</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New password (at least 8 characters)"
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-orange-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
      {message && <p role="status" className="mt-4 text-green-700">{message}</p>}
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      <Link to="/login" className="mt-6 font-semibold text-orange-600">Return to sign in</Link>
    </main>
  );
};

export default ResetPassword;
