import { ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const cartItemCount = cartItems.reduce(
    (count, item) => count + (Number(item.quantity) || 1),
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-6">

        {/* Logo */}
        <Link to="/" className="ml-6 shrink-0">
          <span className="text-2xl font-black tracking-tight text-slate-950">
            NUVO<span className="text-violet-600">RA</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="ml-auto hidden items-center gap-7 md:flex">

          {/* Always visible */}
          <Link
            to="/"
            className="text-sm font-semibold text-slate-950 transition hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Shop
          </Link>

          {/* Admin - only visible to admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Admin
            </Link>
          )}

          {/* Login + Signup - only visible when logged out */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Sign Up
              </Link>
            </>
          )}

        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600"
          >
            <ShoppingBag size={20} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          </Link>

          {/* Profile - only when logged in */}
          {user && (
            <Link
              to="/profile"
              className="hidden rounded-full bg-slate-100 p-2.5 text-slate-700 transition hover:bg-violet-100 hover:text-violet-600 sm:block"
            >
              <UserRound size={20} />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;