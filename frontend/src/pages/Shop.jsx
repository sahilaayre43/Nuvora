import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafaff] px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />

            <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">
              NUVORA SHOP
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#171329] sm:text-4xl">
                Everything You Want.
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Explore our collection of premium products.
              </p>
            </div>

            {/* Product Count */}
            <div className="w-fit rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs text-gray-400">
                Available Products
              </p>

              <p className="mt-0.5 text-lg font-bold text-[#171329]">
                {products.length}
              </p>
            </div>

          </div>

        </div>

        {/* Search Section */}
        <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(80,50,150,0.05)] sm:p-5">

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
              className="h-12 w-full rounded-2xl border border-gray-200 bg-[#fcfbff] pl-12 pr-4 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
            />

          </div>

          {/* Search Result Info */}
          {search && !loading && (
            <div className="mt-3 px-1">
              <p className="text-xs text-gray-500">
                Showing{' '}
                <span className="font-semibold text-purple-600">
                  {filteredProducts.length}
                </span>{' '}
                result
                {filteredProducts.length !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-gray-700">
                  "{search}"
                </span>
              </p>
            </div>
          )}

        </div>

        {/* Products Header */}
        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#171329]">
              {search ? 'Search Results' : 'All Products'}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {loading
                ? 'Loading products...'
                : `${filteredProducts.length} products`}
            </p>
          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
              >
                <div className="aspect-square animate-pulse bg-purple-50" />

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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* No Products */
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(80,50,150,0.05)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">

              <svg
                className="h-7 w-7 text-purple-500"
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
              We couldn't find any products matching "{search}".
              Try searching for something else.
            </p>

            <button
              onClick={() => setSearch('')}
              className="mt-5 rounded-full bg-[#6d35e8] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5c27d6]"
            >
              Clear Search
            </button>

          </div>

        )}

      </div>
    </div>
  );
};

export default Shop;