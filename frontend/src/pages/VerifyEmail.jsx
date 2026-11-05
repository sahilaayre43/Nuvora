import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  const verify = async () => {
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Email verification failed.");
      setVerified(true);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Email verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to resend the email.");
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to resend the email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-[#17213d]">Email verification</h1>
      {token && !verified ? (
        <>
          <p className="mt-3 text-[#66708a]">Confirm your email address to activate your NUVORA account.</p>
          <button
            type="button"
            onClick={verify}
            disabled={isSubmitting}
            className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-[#66708a]">
            {verified
              ? message
              : initialEmail
                ? `Check ${initialEmail} for your verification link. You can request another below.`
                : "Enter your account email and we can send a new verification link."}
          </p>
          {!verified && (
            <form onSubmit={resend} className="mt-6 space-y-4">
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
                {isSubmitting ? "Sending..." : "Resend verification email"}
              </button>
            </form>
          )}
        </>
      )}
      {message && !token && <p role="status" className="mt-4 text-green-700">{message}</p>}
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      <Link to="/login" className="mt-6 font-semibold text-orange-600">Return to sign in</Link>
    </main>
  );
};

export default VerifyEmail;
