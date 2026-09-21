import {
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black tracking-tight">
              NUVO<span className="text-violet-400">RA</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Discover products you'll love, from everyday essentials to
              things worth adding to your wishlist.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium transition hover:bg-violet-500"
  >
    IG
  </a>

  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium transition hover:bg-violet-500"
  >
    X
  </a>

  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium transition hover:bg-violet-500"
  >
    FB
  </a>

  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium transition hover:bg-violet-500"
  >
    YT
  </a>
</div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold">Shop</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <a className="block transition hover:text-white" href="/shop">
                All Products
              </a>
              <a className="block transition hover:text-white" href="/categories">
                Categories
              </a>
              <a className="block transition hover:text-white" href="/deals">
                Deals
              </a>
              <a className="block transition hover:text-white" href="/new">
                New Arrivals
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold">Support</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <a className="block transition hover:text-white" href="/contact">
                Contact Us
              </a>
              <a className="block transition hover:text-white" href="/shipping">
                Shipping
              </a>
              <a className="block transition hover:text-white" href="/returns">
                Returns
              </a>
              <a className="block transition hover:text-white" href="/faq">
                FAQ
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <a className="flex items-center gap-1 transition hover:text-white" href="/about">
                About Nuvora
                <ArrowUpRight size={13} />
              </a>
              <a className="block transition hover:text-white" href="/privacy">
                Privacy
              </a>
              <a className="block transition hover:text-white" href="/terms">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NUVORA. All rights reserved.</p>

          <p>Made for the way you shop.</p>
        </div>
      </div>
    </footer>
  );
}