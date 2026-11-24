import { useContext, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext.jsx";
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

  const resend = async (event) => {
    event.preventDefault();
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
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-[#fafafd] px-4 py-10 text-[#17213d] sm:px-6">
      <div className="pointer-events-none absolute -left-36 top-[12%] h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-[8%] h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1080px]">
        <section className="grid overflow-hidden rounded-[30px] border border-[#eeeeF5] bg-white shadow-[0_24px_80px_rgba(38,42,66,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#f5f0ff] via-[#f7f5ff] to-[#eaf0ff] p-12 lg:flex">
            <div className="absolute -right-16 top-44 h-60 w-60 rounded-full border border-white/60" />
            <div className="absolute -right-5 top-56 h-40 w-40 rounded-full border border-white/60" />

            <Link to="/" className="relative flex w-fit items-center gap-2">
              <span className="relative flex h-9 w-8 items-center justify-center">
                <span className="absolute text-[34px] font-black leading-none text-orange-600">N</span>
                <span className="absolute left-[8px] top-[3px] text-[28px] font-black leading-none text-blue-500">V</span>
              </span>
              <span className="text-[18px] font-extrabold tracking-[5px] text-[#1c2947]">NUVORA</span>
            </Link>

            <div className="relative -mt-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700">
                <Sparkles size={14} />
                One last step
              </span>
              <h1 className="mt-6 max-w-[390px] text-[44px] font-extrabold leading-[1.05] tracking-[-2px] text-[#101727]">
                Your account,
                <span className="block text-orange-600">your way.</span>
              </h1>
              <p className="mt-5 max-w-[350px] text-sm leading-6 text-[#66708a]">
                Confirm your email to keep your account secure and get straight to the good stuff.
              </p>
            </div>

            <div className="relative flex items-center gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 shadow-[0_12px_30px_rgba(49,54,93,0.08)] backdrop-blur">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <ShieldCheck size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#1c2947]">A safer sign-in</span>
                <span className="mt-1 block text-xs text-[#7b849b]">Your code is private and expires soon.</span>
              </span>
              <Check size={18} className="text-emerald-600" />
            </div>
          </aside>

          <div className="flex min-h-[640px] items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
            <div className="w-full max-w-[430px]">
              <div className="mb-9 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-[#7c8499] transition hover:text-orange-600">
                  <ArrowLeft size={15} />
                  Back to store
                </Link>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck size={13} />
                  SECURE
                </span>
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-8 ring-orange-50/60">
                <Mail size={25} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Email verification</p>
              <h2 className="mt-2 text-[32px] font-extrabold tracking-[-1.2px] text-[#101727]">
                {verified ? "You're all set" : "Check your inbox"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#7b849b]">
                {verified
                  ? message
                  : token
                    ? "Confirm your email address to activate your NUVORA account."
                    : sendFailed
                      ? `We couldn't send a code to ${initialEmail}. Check the email setup, then request another.`
                      : initialEmail
                        ? <>We sent a 6-digit code to <span className="font-semibold text-[#343e59]">{initialEmail}</span>. Enter it below to finish creating your account and sign in.</>
                        : "Enter your email and the 6-digit code we sent to finish creating your account and sign in."}
              </p>

              {token && !verified ? (
                <button
                  type="button"
                  onClick={verify}
                  disabled={isSubmitting}
                  className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Verifying..." : "Verify email"}
                  {!isSubmitting && <ArrowRight size={17} />}
                </button>
              ) : !verified && (
                <>
                  <form onSubmit={verify} className="mt-7 space-y-5">
                    <div>
                      <label htmlFor="verification-email" className="mb-2 block text-xs font-bold text-[#29334f]">
                        Email address
                      </label>
                      <input
                        id="verification-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-[#e7e8ef] bg-[#fafafd] px-4 text-sm outline-none transition placeholder:text-[#aeb3c0] focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="verification-code" className="text-xs font-bold text-[#29334f]">
                          6-digit code
                        </label>
                        <span className="text-[11px] text-[#9aa1b1]">Expires in 1 hour</span>
                      </div>
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
                        placeholder="000000"
                        className="h-14 w-full rounded-xl border border-[#e7e8ef] bg-[#fafafd] px-4 text-center font-mono text-2xl font-bold tracking-[0.55em] text-[#17213d] outline-none transition placeholder:text-[#c7cbd4] focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting && submitAction === "verify" ? "Verifying..." : "Verify & continue"}
                      {!(isSubmitting && submitAction === "verify") && <ArrowRight size={17} />}
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="text-xs text-[#8b93a5]">Didn't get the email? Check spam, or</p>
                    <button
                      type="button"
                      onClick={resend}
                      disabled={isSubmitting}
                      className="shrink-0 text-xs font-bold text-orange-600 transition hover:text-orange-700 disabled:opacity-60"
                    >
                      {isSubmitting && submitAction === "resend" ? "Sending..." : "Resend code"}
                    </button>
                  </div>
                </>
              )}

              {message && !verified && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
              {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <div className="mt-8 border-t border-[#eef0f5] pt-5 text-center">
                <Link to="/login" className="text-sm font-semibold text-[#7c8499] transition hover:text-orange-600">
                  Already verified? <span className="text-orange-600">Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerifyEmail;
