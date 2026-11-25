import { useContext, useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiFetch } from "../lib/api";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        setError(data.message || "An error occurred while logging in.");
        setVerificationEmail(data.code === "EMAIL_NOT_VERIFIED" ? email : "");
      }
    } catch {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
    <AuthLayout
      title="Login to Nuvora"
      subtitle="Enter your details to access your account"
      heroTitle="Welcome Back"
      heroDescription="Sign in to continue your shopping journey with Nuvora."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
          <Mail size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
          <label htmlFor="login-email" className="sr-only">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-[#969ba5]"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex h-[60px] items-center rounded-xl border border-[#e1e3e8] bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
          <LockKeyhole size={19} className="shrink-0 text-[#4c515a]" aria-hidden="true" />
          <label htmlFor="login-password" className="sr-only">Password</label>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
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

        <div className="flex items-center justify-between gap-3 pt-1 text-xs sm:text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-[#34383d]">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 accent-orange-600" />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="font-medium text-[#f05a12] hover:underline">
            Forgot Password?
          </Link>
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        {verificationEmail && (
          <Link
            to={`/verify-email?email=${encodeURIComponent(verificationEmail)}`}
            className="block text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Resend verification code
          </Link>
        )}

        <button
          type="submit"
          className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#ff5900] to-[#f04c00] text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Login
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#44474d]">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-[#f05a12] underline underline-offset-2 hover:text-orange-700">
          Create Account
        </Link>
      </p>
    </AuthLayout>
    </div>
  );
}

export default Login;