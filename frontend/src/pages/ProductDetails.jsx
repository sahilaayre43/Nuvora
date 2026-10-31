import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { AuthContext } from '../components/context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, ArrowLeft, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsError, setRelatedProductsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [cartConfirmation, setCartConfirmation] = useState(false);

  useEffect(() => {
    if (!cartConfirmation) return undefined;

    const timeoutId = window.setTimeout(() => {
      setCartConfirmation(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [cartConfirmation]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImageUrl(
          [...new Set([...(Array.isArray(data.images) ? data.images : []), data.imageUrl].filter(Boolean))][0] || ''
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category) return undefined;

    let isCurrent = true;
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || 'Unable to load related products.');
        }
        if (!Array.isArray(data)) {
          throw new Error('The server returned an invalid products response.');
        }

        const category = product.category.trim().toLowerCase();
        const currentProductId = String(product._id || product.id);
        if (isCurrent) {
          setRelatedProducts(
            data
              .filter((item) =>
                item.category?.trim().toLowerCase() === category
                && String(item._id || item.id) !== currentProductId
              )
              .slice(0, 5)
          );
          setRelatedProductsError('');
        }
      } catch (error) {
        if (isCurrent) {
          setRelatedProductsError(error.message || 'Unable to load related products.');
        }
      }
    };

    fetchRelatedProducts();
    return () => {
      isCurrent = false;
    };
  }, [product]);

  const getCartItem = () => ({
    productId: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    qty: 1,
  });

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product || product.stock <= 0) return;

    dispatch(addItem(getCartItem()));
    setCartConfirmation(true);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product || product.stock <= 0) return;

    navigate('/checkout', { state: { buyNow: getCartItem() } });
  };

  const userReview = product?.reviews?.find(
    (review) => String(review.userId) === String(user?._id)
  );
  const isFavorite = favoriteItems.some(
    (item) => String(item._id || item.id) === String(product?._id || product?.id)
  );
  const productImageUrls = [
    ...new Set([
      ...(Array.isArray(product?.images) ? product.images : []),
      product?.imageUrl,
    ].filter(Boolean)),
  ];

  const handleOpenRatingForm = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSelectedRating(userReview?.rating || 0);
    setReviewComment(userReview?.comment || '');
    setRatingError('');
    setShowRatingForm((open) => !open);
  };

  const handleSubmitRating = async (event) => {
    event.preventDefault();
    if (!selectedRating) {
      setRatingError('Choose a star rating before submitting.');
      return;
    }

    setSubmittingRating(true);
    setRatingError('');
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating: selectedRating, comment: reviewComment }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Could not save your rating.');
      }

      setProduct((current) => ({ ...current, ...data }));
      setShowRatingForm(false);
    } catch (error) {
      setRatingError(error.message || 'Could not save your rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f6ff]">
        <p className="text-sm font-semibold text-purple-600">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f6ff]">
        <p className="font-semibold text-red-500">Product not found</p>

        <Link
          to="/shop"
          className="mt-4 text-sm font-semibold text-purple-600"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1200px]">

        {/* Back */}
        <Link
          to="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* ================= IMAGE ================= */}
          <div className="relative min-h-[450px] overflow-hidden rounded-[28px] bg-[#e9ddff] sm:min-h-[560px]">

            {/* Decorative background */}
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />

            <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

            {/* Category */}
            <div className="absolute left-6 top-6 z-10">
              <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-purple-700 shadow-sm backdrop-blur">
                {product.category}
              </span>
            </div>

            {/* Wishlist */}
            <button
              type="button"
              aria-label={isFavorite ? 'Remove product from likes' : 'Like product'}
              aria-pressed={isFavorite}
              onClick={() => dispatch(toggleFavorite(product))}
              className={`absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition hover:text-purple-600 ${
                isFavorite ? 'text-rose-600' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Image */}
            <div className="relative flex h-full min-h-[450px] items-center justify-center px-8 pb-24 pt-20 sm:min-h-[560px] sm:pb-28 sm:pt-24">
              {selectedImageUrl || productImageUrls[0] ? (
                <img
                  src={selectedImageUrl || productImageUrls[0]}
                  alt={product.name}
                  className="max-h-[360px] w-full scale-110 object-contain drop-shadow-2xl transition-transform duration-300 sm:max-h-[440px] sm:scale-125"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Image unavailable
                </span>
              )}
            </div>

            {productImageUrls.length > 1 && (
              <div
                className="absolute bottom-5 left-5 right-5 z-10 flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-2xl bg-white/75 p-2 backdrop-blur-md"
                aria-label="Product images"
              >
                {productImageUrls.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImageUrl(imageUrl)}
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={selectedImageUrl === imageUrl}
                    className={`h-16 w-16 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition sm:h-[72px] sm:w-[72px] ${
                      selectedImageUrl === imageUrl
                        ? 'border-purple-600 ring-2 ring-purple-200'
                        : 'border-transparent hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col rounded-[28px] border border-purple-100 bg-white p-6 shadow-[0_10px_40px_rgba(80,50,150,0.07)] sm:p-8">

            {/* Small heading */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-600" />

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-purple-600">
                NUVORA
              </span>
            </div>

            {/* Name */}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#171329] sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">

              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                <span className="text-sm font-bold text-gray-700">
                  {product.rating || 0}
                </span>
              </div>

              <span className="text-sm text-gray-400">
                {product.numReviews || 0} reviews
              </span>

              <button
                type="button"
                onClick={handleOpenRatingForm}
                aria-expanded={showRatingForm}
                className="ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-900"
              >
                <Star className="h-4 w-4" />
                {userReview ? 'Update your rating' : 'Rate this product'}
              </button>

            </div>

            {showRatingForm && (
              <form onSubmit={handleSubmitRating} className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-sm font-semibold text-gray-700">Choose your rating</p>
                <div className="mt-2 flex items-center gap-1" role="group" aria-label="Choose a rating from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      aria-label={`${star} star${star === 1 ? '' : 's'}`}
                      aria-pressed={selectedRating === star}
                      className="rounded p-1 text-amber-500 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-amber-600"
                    >
                      <Star className={`h-7 w-7 ${star <= selectedRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedRating ? `${selectedRating} out of 5` : 'Select stars'}
                  </span>
                </div>
                <label className="mt-3 block text-xs font-medium text-gray-600" htmlFor="review-comment">
                  Comment (optional)
                </label>
                <textarea
                  id="review-comment"
                  rows="2"
                  maxLength="500"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  className="mt-1 w-full resize-y rounded-lg border border-gray-200 bg-white p-2 text-sm outline-none focus:border-amber-400"
                  placeholder="Share a few words about this product"
                />
                {ratingError && <p role="alert" className="mt-2 text-sm text-red-600">{ratingError}</p>}
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="mt-3 rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingRating ? 'Saving...' : userReview ? 'Update rating' : 'Submit rating'}
                </button>
              </form>
            )}

            {/* Price */}
            <div className="mt-7 rounded-2xl bg-[#f6f1ff] p-5">

              <p className="text-xs font-medium text-gray-400">
                Price
              </p>

              <p className="mt-1 text-3xl font-extrabold text-[#6d35e8]">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </p>

            </div>

            {/* Description */}
            <div className="mt-7">

              <h2 className="text-sm font-bold text-[#171329]">
                About this product
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {product.description}
              </p>

            </div>

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  product.stock > 0
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  product.stock > 0
                    ? 'text-emerald-600'
                    : 'text-red-500'
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} units available`
                  : 'Currently out of stock'}
              </span>

            </div>

            {/* Purchase actions */}
            {cartConfirmation && (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 shrink-0" />
                  Added to your cart
                </span>
                <Link
                  to="/cart"
                  className="shrink-0 font-bold text-emerald-800 underline-offset-2 hover:underline"
                >
                  View cart
                </Link>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#6d35e8] px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-[#5c27d6] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {!user ? 'Login to Buy' : product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                aria-label="Add to cart"
                className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 rounded-2xl border border-gray-100 bg-[#fafaff]">

              <div className="flex flex-col items-center px-2 py-4 text-center">
                <Truck className="h-5 w-5 text-purple-600" />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Fast Delivery
                </p>
              </div>

              <div className="border-x border-gray-100 px-2 py-4 text-center">
                <ShieldCheck className="mx-auto h-5 w-5 text-emerald-500" />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Secure Payment
                </p>
              </div>

              <div className="px-2 py-4 text-center">
                <RotateCcw className="mx-auto h-5 w-5 text-amber-500" />

                <p className="mt-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  Easy Returns
                </p>
              </div>

            </div>

          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 sm:p-8" aria-labelledby="reviews-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="reviews-heading" className="text-xl font-bold text-[#171329]">Customer reviews</h2>
            <span className="text-sm text-gray-500">{product.numReviews || 0} total</span>
          </div>
          {product.reviews?.length ? (
            <div className="mt-5 divide-y divide-gray-100">
              {product.reviews.map((review) => (
                <article key={review._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                    <time className="text-xs text-gray-400" dateTime={review.createdAt}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 text-amber-400 ${star <= review.rating ? 'fill-amber-400' : ''}`} />
                    ))}
                  </div>
                  {review.comment && <p className="mt-2 text-sm leading-6 text-gray-600">{review.comment}</p>}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No reviews yet. Be the first to rate this product.</p>
          )}
        </section>

        {relatedProductsError ? (
          <p role="alert" className="mt-8 rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-600">
            Could not load related products: {relatedProductsError}
          </p>
        ) : relatedProducts.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-4 sm:p-6" aria-labelledby="related-products-heading">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
              <h2 id="related-products-heading" className="text-lg font-bold text-[#171329] sm:text-xl">
                More from {product.category}
              </h2>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="shrink-0 text-sm font-bold text-purple-700 hover:text-purple-900"
              >
                View category
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;