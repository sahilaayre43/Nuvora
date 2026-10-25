import { ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useSelector } from "react-redux";

const navLinkClass =
  "relative inline-flex px-2 py-2 text-sm text-slate-800 transition-colors duration-200 after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-violet-600 after:transition-[width] after:duration-200 hover:text-violet-700 hover:after:w-1/2 focus-visible:text-violet-700 focus-visible:outline-none focus-visible:after:w-1/2";

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
        <Link to="/" className="ml-6 flex shrink-0 items-center gap-2">
          <img src="/nuvora-mark.svg" alt="" className="h-11 w-10 object-contain" />
          <span className="flex items-center gap-[0.12em] text-xl font-black tracking-[0.08em] text-slate-950">
            <span className="relative inline-block">
              N
              <span className="absolute right-0 top-[2px] h-2 w-2 bg-violet-600 [clip-path:polygon(0_0,100%_0,100%_100%)]" />
            </span>
            <span>U</span>
            <span>V</span>
            <span>O</span>
            <span>R</span>
            <span className="relative inline-block">
              A
              <span className="absolute left-1/2 top-[58%] h-1 w-1 -translate-x-1/2 rounded-full bg-violet-600" />
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="ml-auto hidden items-center gap-2 md:flex">

          {/* Always visible */}
          <Link
            to="/"
            className={`${navLinkClass} font-semibold`}
          >
            Home
          </Link>

          <Link
            to="/shop"
            className={`${navLinkClass} font-medium`}
          >
            Shop
          </Link>

          {/* Admin - only visible to admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`${navLinkClass} font-medium`}
            >
              Admin
            </Link>
          )}

          {/* Login + Signup - only visible when logged out */}
          {!user && (
            <>
              <Link
                to="/login"
                className={`${navLinkClass} font-medium`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-300/60"
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
              className="ml-3 hidden rounded-full bg-slate-100 p-2.5 text-slate-700 transition hover:bg-violet-100 hover:text-violet-600 sm:block"
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