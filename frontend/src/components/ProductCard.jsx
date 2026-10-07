import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl || product.image;
  const productId = product._id || product.id;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eeeeF5] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/70">
      <Link
        to={`/product/${productId}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-50 to-[#f7f6fb]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Image unavailable
            </div>
          )}
          {product.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-violet-700 shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-11 text-sm font-bold leading-5 text-[#17213d]">
            {product.name}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <p className="text-lg font-extrabold text-violet-700">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </p>
            <span className="text-xs font-bold text-violet-600 transition group-hover:translate-x-0.5">
              View product →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;