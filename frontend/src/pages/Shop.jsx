import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loadProductCatalog, refreshProductCatalog } from '../lib/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category')?.trim() || '';

  const setSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('search', value);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

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
            .catch((fetchError) => {
              console.warn('Could not refresh the published product catalog:', fetchError);
            });
        }
      } catch (fetchError) {
        if (isCurrent) {
          setError(fetchError.message || 'Unable to load products.');
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

  const categoryProducts = products.filter((product) =>
    !category || product.category?.trim().toLowerCase() === category.toLowerCase()
  );
  const filteredProducts = categoryProducts.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fffdfb] px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1200px]">

        {/* Page Header */}
        <div className="mb-8">

          {category && (
            <Link
              to="/shop"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <ArrowLeft size={16} />
              Back to all products
            </Link>
          )}

          {!category && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />

              <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                NUVORA SHOP
              </span>
            </div>
          )}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#171329] sm:text-4xl">
                {category || 'Everything You Want.'}
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {category
                  ? `Explore products in ${category}.`
                  : 'Explore our collection of premium products.'}
              </p>
            </div>

          </div>

        </div>

        {/* Search Section */}
        <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(90,45,20,0.05)] sm:p-5">

          <div className="relative">

            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-[#fcfbff] pl-12 pr-4 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
            />

          </div>

          {/* Search Result Info */}
          {(search || category) && !loading && (
            <div className="mt-3 px-1">
              <p className="text-xs text-gray-500">
                Showing{' '}
                <span className="font-semibold text-orange-600">
                  {filteredProducts.length}
                </span>{' '}
                product
                {filteredProducts.length !== 1 ? 's' : ''} for{' '}
                {search && (
                  <span className="font-semibold text-gray-700">
                    "{search}"
                  </span>
                )}
                {search && category && ' in '}
                {category && (
                  <span className="font-semibold text-gray-700">{category}</span>
                )}
              </p>
            </div>
          )}

        </div>

        {/* Products Header */}
        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#171329]">
              {search ? 'Search Results' : category ? `${category} Products` : 'All Products'}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {loading
                ? 'Loading products...'
                : `${filteredProducts.length} products`}
            </p>
          </div>

        </div>

        {/* Loading */}
        {error ? (
          <div role="alert" className="rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center text-sm text-red-700">
            Could not load products: {error}
          </div>
        ) : loading ? (

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
              >
                <div className="aspect-square animate-pulse bg-orange-50" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}

          </div>

        ) : filteredProducts.length > 0 ? (

          /* Product Grid */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* No Products */
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(90,45,20,0.05)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">

              <svg
                className="h-7 w-7 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

            </div>

            <h3 className="mt-5 text-lg font-semibold text-[#171329]">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {category
                ? `There are no products in ${category}${search ? ` matching "${search}"` : ''}.`
                : search
                  ? `We couldn't find any products matching "${search}". Try searching for something else.`
                  : 'There are no products available right now.'}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="rounded-full bg-[#ff4f0a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e94300]"
                >
                  Clear Search
                </button>
              )}
              {category && (
                <Link
                  to="/shop"
                  className="rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                >
                  Browse all products
                </Link>
              )}
            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default Shop;