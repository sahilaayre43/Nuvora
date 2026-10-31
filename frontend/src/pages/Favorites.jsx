import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const favoriteItems = useSelector((state) => state.favorites.items);

  return (
    <main className="min-h-screen bg-[#fafaff] px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#171329] sm:text-3xl">
              Liked Products
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {favoriteItems.length} saved {favoriteItems.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>

        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {favoriteItems.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-bold text-[#171329]">
              No liked products yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Tap the heart on a product to save it here.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              Explore products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;
