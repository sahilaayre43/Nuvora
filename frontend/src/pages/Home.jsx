import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Heart,
  Headphones,
  Armchair,
  Camera,
  Footprints,
  Grid2X2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Mail,
  Star,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect, useState} from "react";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    name: "Audio",
    subtitle: "Headphones & more",
    icon: Headphones,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  {
    name: "Furniture",
    subtitle: "Smart & Modern",
    icon: Armchair,
    bg: "bg-emerald-100",
    color: "text-emerald-500",
  },
  {
    name: "Cameras",
    subtitle: "Capture moments",
    icon: Camera,
    bg: "bg-amber-100",
    color: "text-amber-500",
  },
  {
    name: "Footwear",
    subtitle: "Step in style",
    icon: Footprints,
    bg: "bg-rose-100",
    color: "text-rose-500",
  },
  {
    name: "More",
    subtitle: "Explore all",
    icon: Grid2X2,
    bg: "bg-blue-100",
    color: "text-blue-500",
  },
];

const products = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    rating: "4.8",
    reviews: "320",
    price: "₹299.99",
    oldPrice: "₹399.99",
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    bg: "bg-violet-100",
  },
  {
    name: "Minimalist Modern Chair",
    rating: "4.7",
    reviews: "180",
    price: "₹150",
    oldPrice: "₹175",
    discount: "-15%",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85",
    bg: "bg-emerald-100",
  },
  {
    name: "Professional DSLR Camera",
    rating: "4.9",
    reviews: "410",
    price: "₹1199.99",
    oldPrice: "₹1333.99",
    discount: "-10%",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",
    bg: "bg-amber-100",
  },
  {
    name: "Classic White Sneakers",
    rating: "4.6",
    reviews: "220",
    price: "₹85",
    oldPrice: "₹100",
    discount: "-15%",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    bg: "bg-rose-100",
  },
];

const benefits = [
  {
    title: "Fast Delivery",
    description: "Get your order in 2-3 days",
    icon: Truck,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  {
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: ShieldCheck,
    bg: "bg-emerald-100",
    color: "text-emerald-500",
  },
  {
    title: "Easy Returns",
    description: "7 days easy returns",
    icon: RotateCcw,
    bg: "bg-amber-100",
    color: "text-amber-500",
  },
  {
    title: "24/7 Support",
    description: "We're here for you always",
    icon: Headset,
    bg: "bg-rose-100",
    color: "text-rose-500",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.slice(0,4));
      }
       catch (error) {
        console.error("Error fetching products:", error);
      }
       finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#17213d]">

      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5">
        <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-gradient-to-r from-[#f8f8ff] via-[#f4f0ff] to-[#e8e3ff]">

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-28 h-[380px] w-[380px] rounded-full bg-violet-300/30 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[100px] h-[300px] w-[300px] rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative grid h-full min-h-[430px] grid-cols-1 lg:grid-cols-[46%_54%]">

            {/* LEFT */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-10 xl:px-12">

              {/* Badge */}
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#35227e]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  ✦
                </span>
                New Collection
              </div>

              <h1 className="max-w-[530px] text-[42px] font-extrabold leading-[1.05] tracking-[-1.8px] text-[#080b12] sm:text-[50px]">
                Everything You Want.
                <span className="block text-[#6338e8]">
                  One Place.
                </span>
              </h1>

              <p className="mt-5 max-w-[420px] text-[15px] leading-6 text-[#66708a]">
                Premium products. Top brands. Great prices.
                <br />
                Made for the way you shop today.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button className="flex items-center gap-3 rounded-full bg-[#6232e8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/40 transition hover:bg-[#5125cf]">
                  Shop Now
                  <ArrowRight size={17} />
                </button>

                <button className="rounded-full border border-[#e0e1eb] bg-white/80 px-6 py-3 text-sm font-bold text-[#202942] transition hover:border-violet-300 hover:text-violet-600">
                  Explore Categories
                </button>
              </div>

              {/* Trust */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-[#c99b7c]" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-[#8d6e63]" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-[#d7a982]" />
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-[#705548]" />
                </div>

                <span className="text-xs font-medium text-[#69718a]">
                  Trusted by{" "}
                  <span className="font-bold text-[#202942]">
                    10K+ happy customers
                  </span>{" "}
                  <span className="text-violet-500">♥</span>
                </span>
              </div>
            </div>

            {/* RIGHT PRODUCT COMPOSITION */}
            <div className="relative hidden lg:block">

              {/* Chair */}
              <div className="absolute bottom-[58px] left-[31%] z-20">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85"
                  alt="Modern chair"
                  className="h-[285px] w-[285px] object-contain mix-blend-multiply"
                />
              </div>

              {/* Headphones */}
              <div className="absolute left-[17%] top-[22px] z-30">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85"
                  alt="Headphones"
                  className="h-[190px] w-[190px] object-contain mix-blend-multiply"
                />
              </div>

              {/* Camera */}
              <div className="absolute bottom-[42px] left-[9%] z-40">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=85"
                  alt="Camera"
                  className="h-[135px] w-[175px] object-contain mix-blend-multiply"
                />
              </div>

              {/* Shoes */}
              <div className="absolute bottom-[62px] right-[3%] z-40 rotate-[-5deg]">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
                  alt="Sneakers"
                  className="h-[175px] w-[240px] object-contain mix-blend-multiply"
                />
              </div>

              {/* Platform */}
              <div className="absolute bottom-[5px] left-[17%] h-[80px] w-[72%] rounded-[50%] bg-white/90 shadow-[0_-10px_40px_rgba(110,70,230,0.12)]" />

              {/* Free delivery */}
              <div className="absolute right-5 top-8 z-50 w-[150px] rounded-2xl border border-white/70 bg-white/75 p-4 shadow-lg shadow-violet-200/30 backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <Truck size={16} />
                  </div>
                  <span className="text-xs font-bold">Free Delivery</span>
                </div>

                <p className="mt-2 text-[10px] text-gray-500">
                  On orders above
                </p>

                <p className="mt-1 text-xs font-extrabold">₹499</p>
              </div>

              {/* Decorative shapes */}
              <div className="absolute left-[8%] top-[48%] text-4xl text-violet-300">
                ✦
              </div>

              <div className="absolute right-[5%] bottom-[18%] h-10 w-10 rounded-full bg-violet-300/50 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY ================= */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5">
        <div className="rounded-[28px] border border-[#eeeeF5] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(30,30,60,0.03)]">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-[#101727]">
              Shop by Category
            </h2>

            <button className="flex items-center gap-1 text-xs font-bold text-[#29334f] hover:text-violet-600">
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.name}
                  className="group flex items-center gap-3 rounded-full border border-[#f0f0f5] bg-white px-3 py-2.5 text-left shadow-[0_5px_18px_rgba(30,30,60,0.04)] transition hover:-translate-y-0.5 hover:border-violet-200"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${category.bg} ${category.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{category.name}</p>
                    <p className="truncate text-[10px] text-[#8990a3]">
                      {category.subtitle}
                    </p>
                  </div>

                  <ChevronRight
                    size={15}
                    className="text-[#a1a7b7] transition group-hover:translate-x-0.5 group-hover:text-violet-500"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5">
        <div className="rounded-[28px] border border-[#eeeeF5] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(30,30,60,0.03)]">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-[#101727]">
              Featured Products
            </h2>

            <button className="flex items-center gap-1 text-xs font-bold text-[#29334f] hover:text-violet-600">
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.name} className="group">

                {/* Image */}
                <div
                  className={`relative flex h-[235px] items-center justify-center overflow-hidden rounded-2xl ${product.bg}`}
                >
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-violet-500/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {product.discount}
                  </span>

                  <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#6d7487] backdrop-blur transition hover:bg-white hover:text-violet-600">
                    <Heart size={16} />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-5 mix-blend-multiply transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="px-2 pt-3">

                  <h3 className="min-h-[38px] text-[13px] font-extrabold leading-[18px] text-[#111827]">
                    {product.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-bold text-amber-500">
                      {product.rating}
                    </span>
                    <span className="text-[#9ba1b1]">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[15px] font-extrabold text-violet-600">
                      {product.price}
                    </span>

                    <span className="text-[11px] text-[#a5a9b5] line-through">
                      {product.oldPrice}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 text-[11px] font-bold text-violet-600 transition hover:bg-violet-600 hover:text-white">
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>

                    <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8e9ef] bg-white text-[#737b91] hover:border-violet-200 hover:text-violet-600">
                      <Heart size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5">
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#eeeeF5] bg-white sm:grid-cols-2 lg:grid-cols-4">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className={`flex items-center gap-4 px-7 py-6 ${
                  index !== benefits.length - 1
                    ? "border-b border-[#eeeeF5] lg:border-b-0 lg:border-r"
                    : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${benefit.bg} ${benefit.color}`}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-xs font-extrabold">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-4 text-[#8990a3]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#f0eaff] via-[#eee9ff] to-[#e8f0ff] px-8 py-6">

          <div className="absolute right-5 top-[-30px] text-7xl font-thin text-violet-400/50">
            〰
          </div>

          <div className="relative flex flex-col items-center justify-between gap-5 lg:flex-row">

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/80 text-violet-600 shadow-sm">
                <Mail size={23} />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold">
                  Get Exclusive Offers & Updates
                </h2>

                <p className="mt-1 text-[11px] text-[#727a91]">
                  Join our newsletter and never miss out on deals!
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-[400px] rounded-full bg-white p-1 shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none"
              />

              <button className="rounded-full bg-violet-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;