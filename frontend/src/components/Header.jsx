import {
  Heart,
  House,
  LayoutDashboard,
  ShoppingBag,
  Tags,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useSelector } from "react-redux";

const navLinkClass =
  "relative inline-flex px-2 py-2 text-sm text-slate-800 transition-colors duration-200 after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-violet-600 after:transition-[width] after:duration-200 hover:text-violet-700 hover:after:w-1/2 focus-visible:text-violet-700 focus-visible:outline-none focus-visible:after:w-1/2";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const favoriteItems = useSelector((state) => state.favorites.items);
  const isShopRoute = pathname === "/shop" || pathname.startsWith("/product/");

  const cartItemCount = cartItems.reduce(
    (count, item) => count + (Number(item.quantity) || 1),
    0
  );

  useEffect(() => {
    if (!categoriesOpen || categoriesLoaded) return undefined;

    let isCurrent = true;

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/categories`);
        if (!response.ok) {
          throw new Error(`Category request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Category response was not a list.");
        }

        if (isCurrent) {
          setCategories(data.filter((category) => category?.name));
          setCategoriesLoaded(true);
        }
      } catch (error) {
        if (isCurrent) {
          setCategoriesError(error.message);
        }
      } finally {
        if (isCurrent) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isCurrent = false;
    };
  }, [categoriesOpen, categoriesLoaded]);

  useEffect(() => {
    if (!categoriesOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCategoriesOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [categoriesOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-20 sm:gap-8 sm:px-6 md:gap-3">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-1.5 sm:ml-6 sm:gap-2">
          <img src="/nuvora-mark.svg" alt="" className="h-8 w-7 object-contain sm:h-11 sm:w-10" />
          <span className="flex items-center gap-[0.12em] text-base font-black tracking-[0.08em] text-slate-950 max-[360px]:hidden sm:text-xl">
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
        <div className="ml-auto flex items-center gap-2 md:ml-0">

          {!user && (
            <div className="flex items-center gap-1 md:hidden">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isActive ? "bg-violet-50 text-violet-700" : "text-slate-700"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-xs font-semibold text-white transition ${
                    isActive ? "bg-violet-700" : "bg-violet-600"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </div>
          )}

          {user && (
            <div className="ml-4 flex shrink-0 items-center gap-1 md:ml-0 md:gap-2">
              <NavLink
                to="/cart"
                aria-label="Cart"
                className={({ isActive }) =>
                  `relative inline-flex rounded-full p-2.5 transition ${
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

              <NavLink
                to="/favorites"
                aria-label={`Liked products${favoriteItems.length ? `, ${favoriteItems.length} saved` : ''}`}
                title="Liked products"
                className={({ isActive }) =>
                  `relative inline-flex rounded-full p-2.5 transition ${
                    isActive
                      ? "bg-rose-50 text-rose-600"
                      : "text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                  }`
                }
              >
                <Heart size={20} />
                {favoriteItems.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                    {favoriteItems.length}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/profile"
                aria-label="Profile"
                className={({ isActive }) =>
                  `hidden rounded-full p-2.5 transition md:inline-flex ${
                    isActive
                      ? "bg-violet-100 text-violet-600"
                      : "bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-600"
                  }`
                }
              >
                <UserRound size={20} />
              </NavLink>
            </div>
          )}

        </div>
      </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[80] border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-8px_24px_rgba(30,30,60,0.08)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
          {user?.role !== "admin" && (
            <NavLink
              to="/"
              aria-label="Home"
              title="Home"
              className={({ isActive }) =>
                `flex h-11 w-12 items-center justify-center rounded-xl transition ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600"
                }`
              }
            >
              <House size={21} />
            </NavLink>
          )}

          <NavLink
            to="/shop"
            aria-label="Shop"
            title="Shop"
            className={({ isActive }) =>
              `flex h-11 w-12 items-center justify-center rounded-xl transition ${
                isActive || isShopRoute
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600"
              }`
            }
          >
            <ShoppingBag size={21} />
          </NavLink>

          <button
            type="button"
            aria-label="Browse categories"
            aria-expanded={categoriesOpen}
            aria-controls="mobile-categories-panel"
            title="Categories"
            onClick={() => setCategoriesOpen((open) => !open)}
            className={`flex h-11 w-12 items-center justify-center rounded-xl transition ${
              categoriesOpen
                ? "bg-violet-50 text-violet-700"
                : "text-slate-600"
            }`}
          >
            <Tags size={21} />
          </button>

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              aria-label="Admin"
              title="Admin"
              className={({ isActive }) =>
                `flex h-11 w-12 items-center justify-center rounded-xl transition ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600"
                }`
              }
            >
              <LayoutDashboard size={21} />
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/profile"
              aria-label="Profile"
              title="Profile"
              className={({ isActive }) =>
                `flex h-11 w-12 items-center justify-center rounded-xl transition ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600"
                }`
              }
            >
              <UserRound size={21} />
            </NavLink>
          )}
        </div>
      </nav>

      {categoriesOpen && (
        <>
          <button
            type="button"
            aria-label="Close categories"
            onClick={() => setCategoriesOpen(false)}
            className="fixed inset-0 z-[60] bg-slate-950/30 md:hidden"
          />
          <section
            id="mobile-categories-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-categories-title"
            className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[70] max-h-[60vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl md:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="mobile-categories-title"
                className="text-lg font-extrabold text-slate-900"
              >
                Categories
              </h2>
              <button
                type="button"
                aria-label="Close categories"
                onClick={() => setCategoriesOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {categoriesError ? (
              <p role="alert" className="text-sm text-red-600">
                Could not load categories: {categoriesError}
              </p>
            ) : categoriesLoading ? (
              <p className="text-sm text-slate-500">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-slate-500">
                No categories are available right now.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category._id || category.name}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-violet-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default Navbar;