import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { AuthContext } from '../components/context/AuthContext';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product || product.stock <= 0) return;

    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
      })
    );

    alert('Successfully added to your cart!');
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

      <div className="mx-auto max-w-7xl">

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
              className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-sm backdrop-blur transition hover:text-purple-600"
            >
              <Heart className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative flex h-full min-h-[450px] items-center justify-center p-8 sm:min-h-[560px]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-[480px] w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Image unavailable
                </span>
              )}
            </div>

            {/* Bottom image label */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/70 p-4 backdrop-blur-md">
              <p className="text-xs font-medium text-gray-500">
                NUVORA COLLECTION
              </p>

              <p className="mt-1 text-sm font-bold text-[#171329]">
                Premium quality. Designed for you.
              </p>
            </div>
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

            </div>

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

            {/* Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#6d35e8] text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-[#5c27d6] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              <ShoppingCart className="h-5 w-5" />

              {!user
                ? 'Login to Add to Cart'
                : product.stock > 0
                  ? 'Add to Cart'
                  : 'Out of Stock'}
            </button>

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
      </div>
    </div>
  );
};

export default ProductDetail;