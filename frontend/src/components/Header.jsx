import { ShoppingBag, UserRound } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useSelector } from "react-redux";

const navLinkClass =
  "relative inline-flex px-2 py-2 text-sm text-slate-800 transition-colors duration-200 after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-violet-600 after:transition-[width] after:duration-200 hover:text-violet-700 hover:after:w-1/2 focus-visible:text-violet-700 focus-visible:outline-none focus-visible:after:w-1/2";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const isShopRoute = pathname === "/shop" || pathname.startsWith("/product/");

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
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkClass} font-semibold ${isActive ? "text-violet-700 after:w-1/2" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${navLinkClass} font-medium ${
                isActive || isShopRoute ? "text-violet-700 after:w-1/2" : ""
              }`
            }
          >
            Shop
          </NavLink>

          {/* Admin - only visible to admin */}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${navLinkClass} font-medium ${isActive ? "text-violet-700 after:w-1/2" : ""}`
              }
            >
              Admin
            </NavLink>
          )}

          {/* Login + Signup - only visible when logged out */}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${navLinkClass} font-medium ${isActive ? "text-violet-700 after:w-1/2" : ""}`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-300/60 ${
                    isActive ? "bg-violet-700 shadow-md shadow-violet-300/60" : "bg-violet-600"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </>
          )}

        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative rounded-full p-2.5 transition ${
                isActive
                  ? "bg-violet-50 text-violet-600"
                  : "text-slate-700 hover:bg-violet-50 hover:text-violet-600"
              }`
            }
          >
            <ShoppingBag size={20} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          </NavLink>

          {/* Profile - only when logged in */}
          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `ml-3 hidden rounded-full p-2.5 transition sm:block ${
                  isActive
                    ? "bg-violet-100 text-violet-600"
                    : "bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-600"
                }`
              }
            >
              <UserRound size={20} />
            </NavLink>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;