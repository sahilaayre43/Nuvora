import { ArrowRight, ArrowUpRight, Search, Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";

const categoryImages = [
  {
    matches: ["beauty", "cosmetic", "skincare"],
    src: "/categories/beauty-products.jpg",
  },
  {
    matches: ["electronic", "device", "phone", "tech", "gadget", "camera"],
    src: "/categories/electronic-devices.jpg",
  },
  {
    matches: ["watch", "clock"],
    src: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
  },
  {
    matches: ["fashion", "clothing", "apparel", "footwear", "shoe"],
    src: "/categories/fashion-products.jpg",
  },
  {
    matches: ["decor", "decoration", "home"],
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  },
];

const getCategoryImage = (categoryName, products) => {
  const normalizedName = categoryName.toLowerCase();
  const matchingImage = categoryImages.find(({ matches }) =>
    matches.some((match) => normalizedName.includes(match))
  );
  if (matchingImage) return matchingImage.src;

  const matchingProduct = products.find(
    (product) =>
      product.category?.toLowerCase() === normalizedName &&
      (product.imageUrl || product.image)
  );
  return matchingProduct?.imageUrl || matchingProduct?.image || null;
};

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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/products`);

        if (!response.ok) {
          throw new Error(`Product request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Product response was not a list.");
        }
        setProducts(data);
      } catch (error) {
        setProductsError(error.message);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const fetchCategories = async () => {
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
          const validCategories = data.filter((category) => category?.name);
          if (!validCategories.some((category) => /decor/i.test(category.name))) {
            validCategories.push({ name: "Decor" });
          }
          setCategories(validCategories);
        }
      } catch (error) {
        if (isCurrent) {
          setCategoriesError(error.message);
        }
        console.error("Error fetching categories:", error);
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
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#17213d]">

      <section className="mx-auto max-w-[1536px] px-2 pt-3 sm:px-4 sm:pt-5 lg:px-8">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = searchQuery.trim();
            navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
          }}
          className="mx-auto flex h-12 w-full max-w-2xl items-center rounded-full border border-[#eeeeF5] bg-white p-1.5 shadow-sm lg:hidden"
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-[#8990a3]" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#202942] outline-none placeholder:text-[#8990a3]"
          />
          <button
            type="submit"
            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[#6232e8] px-4 text-xs font-bold text-white transition hover:bg-[#5125cf] sm:px-5 sm:text-sm"
          >
            Search
          </button>
        </form>
      </section>

      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-[1536px] px-2 pt-3 sm:px-4 sm:pt-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#f8f8ff] via-[#f4f0ff] to-[#e8e3ff] sm:rounded-[28px] lg:min-h-[430px]">

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-28 h-[380px] w-[380px] rounded-full bg-violet-300/30 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[100px] h-[300px] w-[300px] rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative grid h-full grid-cols-1 lg:min-h-[430px] lg:grid-cols-[46%_54%]">

            {/* LEFT */}
            <div className="flex flex-col justify-center px-4 py-6 sm:px-12 sm:py-12 lg:px-10 xl:px-12">
              <h1 className="max-w-[530px] text-4xl font-extrabold leading-[1.04] tracking-[-1.4px] text-[#080b12] sm:text-[50px] sm:tracking-[-1.8px]">
                Everything You Want.
                <span className="block text-[#6338e8]">
                  One Place.
                </span>
              </h1>

              <p className="mt-3 max-w-[420px] text-sm leading-6 text-[#66708a] sm:mt-5 sm:text-[15px]">
                Premium products. Top brands. Great prices. Made for the way
                you shop today.
              </p>

              <div className="mt-4 flex flex-col items-stretch gap-2.5 min-[400px]:flex-row min-[400px]:items-stretch sm:mt-7 sm:gap-3">
                <Link to="/shop" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#6232e8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/40 transition hover:bg-[#5125cf] min-[400px]:flex-1 sm:w-auto sm:flex-none sm:px-6">
                  Shop Now
                  <ArrowRight size={17} />
                </Link>

                <a href="#shop-by-category" className="flex min-h-12 w-full items-center justify-center rounded-full border border-[#e0e1eb] bg-white/80 px-5 py-3 text-center text-sm font-bold text-[#202942] transition hover:border-violet-300 hover:text-violet-600 min-[400px]:flex-1 sm:w-auto sm:flex-none sm:px-6">
                  Explore Categories
                </a>
              </div>

              <div aria-hidden="true" className="relative mt-3 h-[115px] overflow-hidden sm:hidden">
                <div className="absolute inset-x-4 bottom-0 h-20 rounded-[50%] bg-white/70 shadow-[0_-8px_30px_rgba(110,70,230,0.12)]" />
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85"
                  alt=""
                  className="absolute bottom-1 left-[2%] z-10 h-[100px] w-[44%] rounded-2xl object-contain shadow-lg shadow-violet-900/10 mix-blend-multiply"
                />
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=85"
                  alt=""
                  className="absolute bottom-0 left-[34%] z-20 h-[88px] w-[38%] rounded-2xl object-contain shadow-lg shadow-violet-900/10 mix-blend-multiply"
                />
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
                  alt=""
                  className="absolute bottom-0 right-0 z-10 h-[92px] w-[42%] rotate-[-5deg] rounded-2xl object-contain shadow-lg shadow-violet-900/10 mix-blend-multiply"
                />
              </div>

              {/* Trust 
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
              </div> */}
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
              <div className="absolute right-5 top-8 z-40 w-[150px] rounded-2xl border border-white/70 bg-white/75 p-4 shadow-lg shadow-violet-200/30 backdrop-blur">
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
      <section id="shop-by-category" className="mx-auto max-w-[1536px] px-2 pt-4 sm:px-4 sm:pt-8 lg:px-8">
        {categoriesError ? (
          <div className="rounded-2xl border border-red-100 bg-white px-5 py-4">
            <p role="alert" className="text-sm text-red-600">
              Could not load categories: {categoriesError}
            </p>
          </div>
        ) : categoriesLoading ? (
          <div className="rounded-2xl border border-[#eeeeF5] bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-[#eeeeF5] bg-white px-5 py-4">
            <p className="text-sm text-gray-500">
              Categories will appear here as products are added.
            </p>
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#eeeeF5] bg-white px-3 py-4 shadow-[0_8px_30px_rgba(30,30,60,0.03)] sm:rounded-[28px] sm:px-6 sm:py-6">
            <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-[#101727] sm:text-xl">
                  Shop by Category
                </h2>
              </div>
              {categories.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories((visible) => !visible)}
                  aria-expanded={showAllCategories}
                  className="hidden items-center gap-1 text-xs font-bold text-[#29334f] hover:text-violet-600 sm:flex"
                >
                  {showAllCategories ? "Show less" : "View all"}
                  <ArrowUpRight size={15} />
                </button>
              )}
            </div>
            <div
              aria-label="Scroll to browse categories"
              className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:grid-cols-5 lg:gap-x-6"
            >
              {categories.map((category, index) => {
                const image = getCategoryImage(category.name, products);

                return (
                  <Link
                    key={category.name}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className={`group flex w-[43%] min-w-[128px] max-w-[190px] shrink-0 snap-start flex-col items-center rounded-2xl p-1 text-center transition-colors hover:bg-[#fcfaff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 sm:w-auto sm:min-w-0 sm:max-w-none sm:shrink sm:snap-none sm:p-2 ${
                      !showAllCategories && index >= 5 ? "sm:hidden" : ""
                    }`}
                  >
                    <div
                      className="h-[120px] w-full overflow-hidden rounded-t-[999px] rounded-b-xl bg-gradient-to-b from-[#fbe5f0] via-[#f5e5f7] to-[#ead9f5] shadow-[0_6px_18px_rgba(75,45,95,0.07)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(75,45,95,0.12)] sm:h-[140px] lg:h-[190px]"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="h-full w-full bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,255,255,0.85),transparent_58%)]"
                        />
                      )}
                    </div>

                    <div className="mt-3 flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-[#222839] sm:text-sm">
                        {category.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-10 bg-violet-500 transition-all group-hover:w-14"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section id="featured-products" className="mx-auto max-w-[1536px] px-2 pt-4 sm:px-4 sm:pt-5 lg:px-8">
        <div className="rounded-[24px] border border-[#eeeeF5] bg-white px-2 py-4 shadow-[0_8px_30px_rgba(30,30,60,0.03)] sm:rounded-[28px] sm:px-6 sm:py-6">

          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h2 className="text-base font-extrabold text-[#101727] sm:text-lg">
              Featured Products
            </h2>

            <Link
              to="/shop"
              className="flex items-center gap-1 text-xs font-bold text-[#29334f] hover:text-violet-600"
            >
              View all
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {productsError ? (
            <p role="alert" className="text-sm text-red-600">
              Could not load products: {productsError} Try refreshing the page.
            </p>
          ) : loading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {products.slice(0, 15).map((product) => (
                <ProductCard key={product._id || product.id || product.name} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="mx-auto max-w-[1536px] px-2 pt-4 sm:px-4 sm:pt-5 lg:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-[#eeeeF5] bg-white sm:rounded-[28px] lg:grid-cols-4">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className={`flex flex-col items-center gap-2 px-2 py-4 text-center sm:flex-row sm:gap-4 sm:px-7 sm:py-6 sm:text-left ${
                  index < 2 ? "border-b border-[#eeeeF5] lg:border-b-0" : ""
                } ${
                  index % 2 === 0 ? "border-r border-[#eeeeF5] lg:border-r" : ""
                } ${
                  index === 1 ? "lg:border-r" : ""
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

      {/*
      <section className="mx-auto max-w-[1536px] px-2 pb-5 pt-4 sm:px-4 sm:pt-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#f0eaff] via-[#eee9ff] to-[#e8f0ff] px-4 py-5 sm:rounded-[28px] sm:px-8 sm:py-6">

          <div className="absolute right-5 top-[-30px] text-7xl font-thin text-violet-400/50">
            〰
          </div>

          <div className="relative flex flex-col items-stretch justify-between gap-5 sm:items-center lg:flex-row">

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-violet-600 shadow-sm sm:h-14 sm:w-14">
                <Mail size={23} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold sm:text-[15px]">
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
                className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none sm:px-4"
              />

              <button className="shrink-0 rounded-full bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 sm:px-6">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>  */}

    </main>
  );
}

export default Home;
