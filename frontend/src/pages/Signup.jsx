import { useContext, useState } from "react";
import {
  Mail,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiFetch } from "../lib/api";

const Signup  = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code === "VERIFICATION_EMAIL_FAILED" && data.email) {
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}&sendFailed=1`);
          return;
        }
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      if (data.token) {
        login(data);
        navigate("/");
        return;
      }

      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setError(error.message || "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
    <AuthLayout
      title="Create your account"
      subtitle="Join Nuvora and start shopping"
      heroTitle="Create Account"
      heroDescription="Find your next favorite with Nuvora."
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
          <UserRound size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
          <label htmlFor="signup-name" className="sr-only">Full name</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-[#969ba5]"
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
          <Mail size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
          <label htmlFor="signup-email" className="sr-only">Email address</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-[#969ba5]"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
          <LockKeyhole size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
          <label htmlFor="signup-password" className="sr-only">Password</label>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-[#969ba5]"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="shrink-0 text-sm text-[#252830] underline underline-offset-2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-5 text-[#53575e]">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600" />
          <span>
            I agree to the{" "}
            <button type="button" className="font-semibold text-[#f05a12]">Terms &amp; Conditions</button>
            {" "}and{" "}
            <button type="button" className="font-semibold text-[#f05a12]">Privacy Policy</button>
          </span>
        </label>

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#ff5900] to-[#f04c00] text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#44474d]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#f05a12] underline underline-offset-2 hover:text-orange-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
    </div>
  );
}

export default Signup;