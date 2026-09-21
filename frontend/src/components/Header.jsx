import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-6">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <span className="text-2xl font-black tracking-tight text-slate-950">
            NUVO<span className="text-violet-600">RA</span>
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="/"
            className="text-sm font-semibold text-slate-950"
          >
            Home
          </a>

          <a
            href="/shop"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Shop
          </a>

          <button className="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-slate-950">
            Categories
            <ChevronDown size={15} />
          </button>

          <a
            href="/deals"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Deals
          </a>
        </nav>

        {/* Search */}
        <div className="ml-auto hidden w-full max-w-sm md:block">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-violet-400 focus-within:bg-white">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600">
            <Heart size={20} />
          </button>

          <button className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600">
            <ShoppingBag size={20} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
              2
            </span>
          </button>

          <button className="hidden rounded-full bg-slate-100 p-2.5 text-slate-700 transition hover:bg-violet-100 hover:text-violet-600 sm:block">
            <UserRound size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}