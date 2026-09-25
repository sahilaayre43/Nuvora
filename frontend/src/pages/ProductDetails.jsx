import React, {useEffect, useState} from "react";
import { useParams,Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import { addItem } from "../store/cartSlice.js";
import {
  Heart,
  ShoppingCart,
  UserRound,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Zap,
  BatteryMedium,
  Headphones,
  Truck,
  Sparkles,
} from "lucide-react";
const productImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900",
];

const ProductDetails = () =>{

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("black");
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.image,
                quantity: 1
            }));
            alert("Product added to cart!");
        }
    };

   

  return (

<div className="min-h-screen bg-[#fafafd] text-[#17213d] p-4">
     <main className="mx-auto max-w-[1400px] px-7 pb-10">

        <div className="grid gap-7 lg:grid-cols-2">

          {/* ================= IMAGE GALLERY ================= */}
          <section className="overflow-hidden rounded-[28px] border border-[#eeeeF5] bg-white shadow-[0_10px_35px_rgba(40,30,80,0.05)]">

            {/* Main image */}
            <div className="relative flex h-[560px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f1eaff] via-[#f8f6ff] to-[#eeeaff]">

              {/* Discount */}
              <span className="absolute left-6 top-6 z-10 rounded-full bg-violet-600 px-5 py-2 text-sm font-bold text-white">
                -20%
              </span>

              {/* Wishlist */}
              <button className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
                <Heart size={20} />
              </button>

              {/* Previous */}
              <button
                onClick={() =>
                  setSelectedImage(
                    selectedImage === 0
                      ? productImages.length - 1
                      : selectedImage - 1
                  )
                }
                className="absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:text-violet-600"
              >
                <ChevronLeft size={21} />
              </button>

              {/* Product image */}
              <img
                src={productImages[selectedImage]}
                alt="Wireless Noise-Cancelling Headphones"
                className="h-[460px] w-[85%] object-contain mix-blend-multiply"
              />

              {/* Next */}
              <button
                onClick={() =>
                  setSelectedImage(
                    selectedImage === productImages.length - 1
                      ? 0
                      : selectedImage + 1
                  )
                }
                className="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:text-violet-600"
              >
                <ChevronRight size={21} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 border-t border-[#eeeeF5] p-5">

              {productImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`h-[82px] w-[82px] overflow-hidden rounded-xl border-2 bg-[#f7f6fb] p-1 ${
                    selectedImage === index
                      ? "border-violet-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </button>
              ))}

              {/* Video */}
              <button className="flex h-[82px] w-[82px] flex-col items-center justify-center gap-1 rounded-xl bg-[#f4f1fb] text-violet-600">
                <span className="text-xl">▶</span>
                <span className="text-xs font-semibold">Video</span>
              </button>

            </div>
          </section>

          {/* ================= PRODUCT INFO ================= */}
          <section className="rounded-[28px] border border-[#eeeeF5] bg-white p-8 shadow-[0_10px_35px_rgba(40,30,80,0.05)]">

            {/* Badge */}
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-[#f2edff] px-4 py-2 text-xs font-bold text-violet-600">
              <Sparkles size={14} />
              New Arrival
            </div>

            {/* Title */}
            <h1 className="max-w-[600px] text-[38px] font-extrabold leading-[1.12] tracking-[-1.5px] text-[#101727]">
              Wireless Noise-Cancelling Headphones
            </h1>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-3 text-sm">

              <div className="flex items-center gap-1 text-[#f5aa00]">
                <Star size={17} fill="currentColor" />
                <span className="font-bold">4.8</span>
              </div>

              <span className="text-[#8990a3]">
                (320 reviews)
              </span>

              <span className="h-4 w-px bg-[#dddde5]" />

              <span className="text-[#8990a3]">
                2K+ sold
              </span>

            </div>

            {/* Price */}
            <div className="mt-7 flex flex-wrap items-center gap-4">

              <span className="text-[32px] font-extrabold text-violet-600">
                ₹299.99
              </span>

              <span className="text-lg text-[#9da2b0] line-through">
                ₹399.99
              </span>

              <span className="rounded-full bg-[#f3edff] px-4 py-2 text-xs font-bold text-violet-600">
                You save ₹100.00 (20%)
              </span>

            </div>

            {/* Description */}
            <p className="mt-6 max-w-[650px] text-sm leading-7 text-[#687188]">
              Immerse yourself in pure sound with our advanced
              noise-cancelling technology. Perfect for music,
              calls, and everyday use.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-4 border-y border-[#eeeeF5] py-6">

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1eaff] text-violet-600">
                  <Headphones size={20} />
                </div>

                <span className="text-xs font-bold">
                  Active Noise
                </span>

                <span className="text-xs font-bold">
                  Cancellation
                </span>
              </div>

              <div className="flex flex-col items-center border-l border-[#eeeeF5] text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f8f3] text-emerald-500">
                  <BatteryMedium size={20} />
                </div>

                <span className="text-xs font-bold">
                  30H Battery
                </span>

                <span className="text-xs font-bold">
                  Life
                </span>
              </div>

              <div className="flex flex-col items-center border-l border-[#eeeeF5] text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe9f1] text-pink-500">
                  <Zap size={20} />
                </div>

                <span className="text-xs font-bold">
                  Premium
                </span>

                <span className="text-xs font-bold">
                  Sound
                </span>
              </div>

              <div className="flex flex-col items-center border-l border-[#eeeeF5] text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3d8] text-amber-500">
                  <Truck size={20} />
                </div>

                <span className="text-xs font-bold">
                  Fast
                </span>

                <span className="text-xs font-bold">
                  Charging
                </span>
              </div>

            </div>

            {/* Color */}
            <div className="mt-7">

              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">Color:</span>
                <span className="text-[#697188]">
                  {selectedColor === "black"
                    ? "Midnight Black"
                    : selectedColor === "cream"
                    ? "Cream"
                    : "Silver"}
                </span>
              </div>

              
            </div>

            {/* Quantity + Cart */}
            <div className="mt-8 flex items-end gap-5">

              <div>
                <p className="mb-3 text-sm font-bold">
                  Quantity:
                </p>

                <div className="flex h-12 items-center rounded-full border border-[#e5e5ed]">

                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5f2ff]"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5f2ff]"
                  >
                    <Plus size={16} />
                  </button>

                </div>
              </div>

              <button onClick={handleAddToCart} className="flex h-12 flex-1 items-center justify-center gap-3 rounded-full bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

            </div>

            {/* Buy now */}
            <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-violet-200 bg-white text-sm font-bold text-violet-600 transition hover:bg-violet-50">
              <Zap size={17} />
              Buy Now
            </button>

          </section>
        </div>
      </main>
    </div>
  );
}


export default ProductDetails
