import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl || product.image;
  const productId = product._id || product.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFavorite = useSelector((state) =>
    state.favorites.items.some(
      (item) => String(item._id || item.id) === String(productId)
    )
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200/60">

      {/* IMAGE */}
      <Link
        to={`/product/${productId}`}
        className="relative block h-[185px] w-full overflow-hidden bg-gray-100 sm:h-[210px]"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            Image unavailable
          </div>
        )}

        {/* Discount */}
        <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          -20%
        </span>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">

        {/* Product Name */}
        <Link to={`/product/${productId}`}>
          <h2 className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] text-black transition-colors hover:text-gray-600 sm:min-h-[40px] sm:text-sm sm:leading-5">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          {product.numReviews > 0 ? (
            <>
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {Number(product.rating).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({product.numReviews})
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400">No ratings yet</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-sm font-bold text-black sm:text-lg">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          <span className="text-[9px] font-medium text-gray-400 line-through sm:text-xs">
            ₹{(Number(product.price) * 1.25).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto hidden items-center gap-2 pt-3 sm:flex">

          {/* View Details */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${productId}`);
            }}
            className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full border border-black bg-black text-[10px] font-semibold text-white transition hover:bg-gray-800 sm:gap-1.5 sm:text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span className="sm:hidden">Details</span>
            <span className="hidden sm:inline">View Details</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            aria-label={
              isFavorite
                ? `Remove ${product.name} from likes`
                : `Like ${product.name}`
            }
            aria-pressed={isFavorite}
            onClick={() => dispatch(toggleFavorite(product))}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-gray-100 ${
              isFavorite
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>

        </div>
      </div>
    </article>
  );
};

export default ProductCard;
