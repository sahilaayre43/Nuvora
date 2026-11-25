import { useContext, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiFetch } from "../lib/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";
  const sendFailed = searchParams.get("sendFailed") === "1";
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState("");
  const [verified, setVerified] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitAction("verify");
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token } : { email, code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Email verification failed.");
      if (data.token) {
        login(data);
        navigate("/", { replace: true });
        return;
      }
      setVerified(true);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Email verification failed.");
    } finally {
      setIsSubmitting(false);
      setSubmitAction("");
    }
  };

  const resend = async () => {
    setError("");
    setMessage("");
    setSubmitAction("resend");
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
      setSubmitAction("");
    }
  };

  return (
     <div className="max-w-[1400px] mx-auto">
    <AuthLayout
      title={verified ? "You're all set" : "Verify your email"}
      subtitle={
        verified
          ? message
          : token
            ? "Confirm your email address to activate your NUVORA account."
            : sendFailed
              ? `We couldn't send a code to ${initialEmail}. Check the email setup, then request another.`
              : initialEmail
                ? `We sent a 6-digit code to ${initialEmail}. Enter it below to finish creating your account.`
                : "Enter your email and the 6-digit code we sent to finish creating your account."
      }
      heroTitle="Almost There"
      heroDescription="Verify your email to finish setting up your Nuvora account."
    >
      {token && !verified ? (
        <button
          type="button"
          onClick={verify}
          disabled={isSubmitting}
          className="mt-7 flex h-[60px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#ff5900] to-[#f04c00] text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      ) : !verified && (
        <>
          <form onSubmit={verify} className="mt-7 space-y-4">
            <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
              <Mail size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
              <label htmlFor="verification-email" className="sr-only">Email address</label>
              <input
                id="verification-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-[#969ba5]"
              />
            </div>

            <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
              <ShieldCheck size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
              <label htmlFor="verification-code" className="sr-only">6-digit verification code</label>
              <input
                id="verification-code"
                type="text"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Verification code"
                className="ml-4 w-full bg-transparent text-sm tracking-[0.2em] outline-none placeholder:tracking-normal placeholder:text-[#969ba5]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#ff5900] to-[#f04c00] text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && submitAction === "verify" ? "Verifying..." : "Verify & continue"}
              {!(isSubmitting && submitAction === "verify") && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-[#686d75]">Didn&apos;t get the email?</span>
            <button
              type="button"
              onClick={resend}
              disabled={isSubmitting}
              className="font-semibold text-[#f05a12] hover:underline disabled:opacity-60"
            >
              {isSubmitting && submitAction === "resend" ? "Sending..." : "Resend code"}
            </button>
          </div>
        </>
      )}

      {message && !verified && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <p className="mt-7 text-center text-sm text-[#44474d]">
        Already verified?{" "}
        <Link to="/login" className="font-semibold text-[#f05a12] underline underline-offset-2 hover:text-orange-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
    </div>
  );
};

export default VerifyEmail;
