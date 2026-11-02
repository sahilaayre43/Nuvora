import { ArrowLeft, ArrowRight, ArrowUpRight, Search, ShieldCheck, RotateCcw, Headset, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { loadCategoryCatalog, loadProductCatalog, refreshCategoryCatalog, refreshProductCatalog,} from "../lib/api";
import Electronic from "../assets/Electronics.jpg";
import Beauty from "../assets/beauty.jpg";
import Fashion from "../assets/fashion.jpg";

const categoryImages = [
  {
    matches: ["fashion", "clothing", "apparel", "footwear", "shoe"],
    src: Fashion,
  },
  {
    matches: ["electronic", "device", "phone", "tech", "gadget", "camera"],
    src: Electronic,
  },
  {
    matches: ["beauty", "cosmetic", "skincare"],
    src: Beauty,
  },
  {
    matches: ["fitness", "sport", "gym", "active"],
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85",
  },
  {
    matches: ["decor", "decoration", "home"],
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  },
  {
    matches: ["accessories", "accessory", "watch", "clock", "jewelry"],
    src: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=85",
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
  return matchingProduct?.imageUrl
    || matchingProduct?.image
    || categoryImages.find(({ matches }) =>
      matches.some((match) => normalizedName.includes(match))
    )?.src
    || null;
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
    bg: "bg-rose-100",
    color: "text-rose-500",
  },
  {
    title: "24/7 Support",
    description: "We're here for you always",
    icon: Headset,
    bg: "bg-orange-100",
    color: "text-orange-600",
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
  const categoriesSliderRef = useRef(null);

  useEffect(() => {
    let isCurrent = true;
    const fetchProducts = async () => {
      try {
        const data = await loadProductCatalog();
        if (isCurrent) {
          setProducts(data);
        }

        if (import.meta.env.PROD) {
          refreshProductCatalog()
            .then((latestProducts) => {
              if (isCurrent) {
                setProducts(latestProducts);
              }
            })
            .catch((error) => {
              console.warn("Could not refresh the published product catalog:", error);
            });
        }
      } catch (error) {
        if (isCurrent) {
          setProductsError(error.message);
          console.error("Error fetching products:", error);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const fetchCategories = async () => {
      try {
        const data = await loadCategoryCatalog();

        if (isCurrent) {
          const validCategories = data.filter((category) => category?.name);
          if (!validCategories.some((category) => /decor/i.test(category.name))) {
            validCategories.push({ name: "Decor" });
          }
          setCategories(validCategories);

          if (import.meta.env.PROD) {
            refreshCategoryCatalog()
              .then((latestCategories) => {
                if (isCurrent) {
                  const latest = latestCategories.filter((category) => category?.name);
                  if (!latest.some((category) => /decor/i.test(category.name))) {
                    latest.push({ name: "Decor" });
                  }
                  setCategories(latest);
                }
              })
              .catch((error) => {
                console.warn("Could not refresh the published category catalog:", error);
              });
          }
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
    <main className="min-h-screen bg-[#fffdfb] text-[#171717]">

      <section className="mx-auto max-w-[1200px] px-2 pt-3 sm:px-4 sm:pt-5 lg:px-8">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = searchQuery.trim();
            navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
          }}
          className="mx-auto flex h-12 w-full max-w-2xl items-center rounded-full border border-[#eee9e5] bg-white p-1.5 shadow-sm lg:hidden"
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
            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[#ff4f0a] px-4 text-xs font-bold text-white transition hover:bg-[#e94300] sm:px-5 sm:text-sm"
          >
            Search
          </button>
        </form>
      </section>

      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-[1200px] px-2 pt-3 sm:px-4 sm:pt-4 lg:px-7">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-[#fff5ef] shadow-[0_12px_40px_rgba(105,60,35,0.06)] sm:aspect-[93/37] sm:rounded-[26px]">
          <img
            src="/hero-orange-showcase.png"
            alt="A fashion model surrounded by orange and neutral featured products."
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center sm:object-fill"
          />
          <div className="absolute left-[5%] top-[7%] z-10 hidden sm:block">
            <Link
              to="/shop"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#ff4f0a] px-4 text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,79,10,0.24)] transition hover:-translate-y-0.5 hover:bg-[#e94300] sm:h-12 sm:px-6 sm:text-sm"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY ================= */}
      <section id="shop-by-category" className="mx-auto max-w-[1200px] px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
        {categoriesError ? (
          <div className="rounded-2xl border border-red-100 bg-white px-5 py-4">
            <p role="alert" className="text-sm text-red-600">
              Could not load categories: {categoriesError}
            </p>
          </div>
        ) : categoriesLoading ? (
          <div className="rounded-2xl border border-[#eee9e5] bg-white px-5 py-4">
            <p className="text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-[#eee9e5] bg-white px-5 py-4">
            <p className="text-sm text-gray-500">
              Categories will appear here as products are added.
            </p>
          </div>
        ) : (
          <div className="rounded-[22px] border border-[#f0ece9] bg-white px-3 py-4 shadow-[0_8px_30px_rgba(60,40,25,0.045)] sm:rounded-[24px] sm:px-4 sm:py-4">
            <div className="mb-3 flex items-center justify-between gap-4 sm:mb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#17191d] sm:text-lg">
                  Shop by Category
                </h2>
              </div>
              {categories.length > 4 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Scroll categories left"
                    onClick={() => categoriesSliderRef.current?.scrollBy({ left: -categoriesSliderRef.current.clientWidth, behavior: "smooth" })}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee9e5] text-[#29334f] transition hover:border-[#ff4f0a] hover:text-[#f04a0c]"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Scroll categories right"
                    onClick={() => categoriesSliderRef.current?.scrollBy({ left: categoriesSliderRef.current.clientWidth, behavior: "smooth" })}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee9e5] text-[#29334f] transition hover:border-[#ff4f0a] hover:text-[#f04a0c]"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
            <div
              ref={categoriesSliderRef}
              aria-label="Scroll to browse categories"
              className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:pb-0"
            >
              {categories.map((category) => {
                const image = getCategoryImage(category.name, products);

                return (
                  <Link
                    key={category.name}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="group flex w-[38%] min-w-[140px] max-w-[180px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-[#f1eeeb] bg-white text-left shadow-[0_4px_14px_rgba(40,30,20,0.025)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(40,30,20,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a35] focus-visible:ring-offset-2 sm:w-auto sm:min-w-0 sm:max-w-[200px] sm:basis-[30%] md:basis-1/5 lg:basis-1/6 sm:snap-start"
                  >
                    <div
                      className="h-[112px] w-full overflow-hidden bg-[#f7f4f1] sm:h-[126px] lg:h-[112px]"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="h-full w-full bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,255,255,0.85),transparent_58%)]"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 px-2.5 py-2.5 sm:px-3">
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-[#1d2025] sm:text-sm">
                          {category.name}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#707782]">Shop Now</span>
                      </span>
                      <ArrowRight size={16} className="shrink-0 text-[#25282d] transition-transform group-hover:translate-x-1 group-hover:text-[#f04a0c]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section id="featured-products" className="mx-auto max-w-[1200px] px-2 pt-4 sm:px-4 sm:pt-5 lg:px-8">
        <div className="rounded-[24px] border border-[#eeeeF5] bg-white px-2 py-4 shadow-[0_8px_30px_rgba(30,30,60,0.03)] sm:rounded-[28px] sm:px-6 sm:py-6">

          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h2 className="text-base font-extrabold text-[#101727] sm:text-lg">
              Featured Products
            </h2>

            <Link
              to="/shop"
              className="flex items-center gap-1 text-xs font-bold text-[#29334f] hover:text-orange-600"
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {products.slice(0, 15).map((product) => (
                <ProductCard key={product._id || product.id || product.name} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="mx-auto max-w-[1200px] px-2 pt-4 sm:px-4 sm:pt-5 lg:px-8">
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
      <section className="mx-auto max-w-[1200px] px-2 pb-5 pt-4 sm:px-4 sm:pt-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#f0eaff] via-[#eee9ff] to-[#e8f0ff] px-4 py-5 sm:rounded-[28px] sm:px-8 sm:py-6">

          <div className="absolute right-5 top-[-30px] text-7xl font-thin text-orange-400/50">
            〰
          </div>

          <div className="relative flex flex-col items-stretch justify-between gap-5 sm:items-center lg:flex-row">

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-orange-600 shadow-sm sm:h-14 sm:w-14">
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

              <button className="shrink-0 rounded-full bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-700 sm:px-6">
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
