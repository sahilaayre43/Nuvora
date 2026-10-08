import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl || product.image;
  const productId = product._id || product.id;
  const navigate = useNavigate();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-purple-100 bg-[#f3edff] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/70">

      {/* IMAGE - FULL WIDTH, PART OF CARD */}
      <Link
        to={`/product/${productId}`}
        className="relative block h-[210px] w-full overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-purple-100 text-sm text-gray-400">
            Image unavailable
          </div>
        )}

        {/* Discount */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-purple-700 shadow-sm backdrop-blur-sm">
          -20%
        </span>
        
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3.5">

        {/* Product Name */}
        <Link to={`/product/${productId}`}>
          <h2 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-[#171329] transition-colors hover:text-purple-600">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

          <span className="text-xs font-semibold text-gray-600">
            4.8
          </span>

          <span className="text-xs text-gray-400">
            (320)
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[#6d35e8]">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          <span className="text-xs font-medium text-gray-400 line-through">
            ₹{(Number(product.price) * 1.25).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex items-center gap-2 pt-3">

          {/* Add To Cart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${productId}`);
            }}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-purple-200 bg-white/70 text-xs font-semibold text-purple-600 transition hover:border-purple-300 hover:bg-white"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            View Details
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white/70 text-gray-500 transition hover:border-purple-300 hover:bg-white hover:text-purple-600"
          >
            <Heart className="h-4 w-4" />
          </button>

        </div>
      </div>
    </article>
  );
};

export default ProductCard;