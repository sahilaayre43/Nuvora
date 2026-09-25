import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext.jsx";

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const res = fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = res.json();
      if (res.ok) {
        alert("Registration successful! Please check your Email use the code .");}
        login(data);
        navigate("/")
    } catch (error) {
      setError("An error occurred while registering.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafd] px-4 py-8 text-[#17213d]">

      {/* Background decoration */}
      <div className="pointer-events-none fixed left-[-150px] top-[15%] h-[350px] w-[350px] rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none fixed right-[-150px] bottom-[10%] h-[350px] w-[350px] rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-[1150px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#eeeeF5] bg-white shadow-[0_20px_60px_rgba(40,30,80,0.08)] lg:grid-cols-2">

          {/* LEFT */}
          <div className="hidden min-h-[700px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#f5f0ff] via-[#f7f5ff] to-[#eaf0ff] p-12 lg:flex">

            <div>
              <div className="flex items-center gap-2">
                <div className="relative flex h-9 w-8 items-center justify-center">
                  <span className="absolute text-[34px] font-black leading-none text-violet-600">
                    N
                  </span>
                  <span className="absolute left-[8px] top-[3px] text-[28px] font-black leading-none text-blue-500">
                    V
                  </span>
                </div>

                <span className="text-[18px] font-extrabold tracking-[5px] text-[#1c2947]">
                  NUVORA
                </span>
              </div>

              <div className="mt-20">
                <span className="rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-violet-600">
                  Join NUVORA
                </span>

                <h1 className="mt-6 text-[46px] font-extrabold leading-[1.05] tracking-[-2px] text-[#0b1020]">
                  Your style.
                  <span className="block text-violet-600">
                    Your choice.
                  </span>
                </h1>

                <p className="mt-5 max-w-[390px] text-sm leading-6 text-[#66708a]">
                  Create your account and discover products selected
                  for the way you shop today.
                </p>
              </div>
            </div>

            <div className="relative h-[180px]">
              <div className="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-violet-200/60 blur-2xl" />
              <div className="absolute bottom-0 left-16 text-[105px]">
                📷
              </div>

              <div className="absolute bottom-0 right-10 h-28 w-28 rounded-full bg-blue-200/50 blur-2xl" />
              <div className="absolute bottom-2 right-16 text-[90px]">
                🪑
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex min-h-[700px] flex-col justify-center px-7 py-10 sm:px-12 lg:px-16">

            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="relative flex h-9 w-8 items-center justify-center">
                <span className="absolute text-[34px] font-black leading-none text-violet-600">
                  N
                </span>
                <span className="absolute left-[8px] top-[3px] text-[28px] font-black leading-none text-blue-500">
                  V
                </span>
              </div>

              <span className="text-[18px] font-extrabold tracking-[5px]">
                NUVORA
              </span>
            </div>

            <div className="mx-auto w-full max-w-[420px]">

              <Link
                to="/"
                className="mb-7 flex w-fit items-center gap-2 text-xs font-semibold text-[#7c8499] hover:text-violet-600"
              >
                <ArrowLeft size={15} />
                Back to store
              </Link>

              <h2 className="text-3xl font-extrabold tracking-[-1px] text-[#101727]">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-[#8990a3]">
                Join NUVORA and start shopping
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#29334f]">
                    Full name
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#e7e8ef] bg-[#fafafd] px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                    <UserRound size={18} className="text-[#9299ab]" />

                    <input
                      type="text"
                      placeholder="Your full name"
                      className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#aeb3c0]"
                      onChange={(e) => setName(e.target.value)} required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#29334f]">
                    Email address
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#e7e8ef] bg-[#fafafd] px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                    <Mail size={18} className="text-[#9299ab]" />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#aeb3c0]"
                       onChange={(e) => setEmail(e.target.value)} required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#29334f]">
                    Password
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#e7e8ef] bg-[#fafafd] px-4 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                    <LockKeyhole size={18} className="text-[#9299ab]" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#aeb3c0]"
                       onChange={(e) => setPassword(e.target.value)} required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#9299ab] hover:text-violet-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-5 text-[#727a91]">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
                  />

                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-semibold text-violet-600"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-semibold text-violet-600"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>

                {/* Create account */}
                <button
                  type="submit"
                  className="mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  Create Account
                  <ArrowRight size={17} />
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[#8990a3]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-violet-600 hover:text-violet-700"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;