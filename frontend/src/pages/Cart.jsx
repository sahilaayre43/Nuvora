import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, addItem } from '../store/cartSlice'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const navigate = useNavigate()

  const handleRemove = (id) => {
    dispatch(removeItem(id))
  }

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      dispatch(removeItem(item.productId))
      return
    }

    dispatch(addItem({ ...item, quantity }))
  }

 const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafd] px-5 py-10 text-[#17213d] md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-violet-600">
            NUVORA / Cart
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Shopping Cart
          </h2>

          <p className="mt-2 text-sm text-[#7d8498]">
            Review your items before checkout.
          </p>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-[#eeeeF5] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(40,30,80,0.05)]">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1eaff] text-3xl">
              🛒
            </div>

            <h3 className="text-2xl font-bold">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm text-[#7d8498]">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex rounded-full bg-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              Go Shopping →
            </Link>

          </div>
        ) : (

          <div className="grid gap-7 lg:grid-cols-[1fr_380px]">

            {/* Cart Items */}
            <div className="space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-5 rounded-[24px] border border-[#eeeeF5] bg-white p-5 shadow-[0_8px_30px_rgba(40,30,80,0.04)] sm:flex-row sm:items-center"
                >

                  {/* Product Image */}
                  <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#f3efff] sm:w-32">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain p-3 mix-blend-multiply"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">

                    <h4 className="text-lg font-bold text-[#17213d]">
                      {item.name}
                    </h4>

                    <p className="mt-2 text-lg font-extrabold text-violet-600">
                      ₹{item.price}
                    </p>

                    {/* Quantity */}
                    <div className="mt-5 flex items-center gap-4">

                      <span className="text-sm font-semibold text-[#737b90]">
                        Quantity
                      </span>

                      <div className="flex h-10 items-center rounded-full border border-[#e5e2ed] bg-white">

                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item,
                              item.quantity - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-[#f1eaff] hover:text-violet-600"
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-[#f1eaff] hover:text-violet-600"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="self-start rounded-full px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 sm:self-center"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-[26px] border border-[#eeeeF5] bg-white p-7 shadow-[0_10px_35px_rgba(40,30,80,0.05)] lg:sticky lg:top-6">

              <h3 className="text-xl font-extrabold">
                Order Summary
              </h3>

              <div className="mt-6 space-y-4 border-b border-[#eeeeF5] pb-6">

                <div className="flex justify-between text-sm">
                  <span className="text-[#737b90]">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#737b90]">
                    Delivery
                  </span>

                  <span className="font-semibold text-emerald-500">
                    FREE
                  </span>
                </div>

              </div>

              <div className="flex justify-between py-6">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-violet-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full rounded-full bg-violet-600 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Proceed to Checkout →
              </button>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-semibold text-[#737b90] transition hover:text-violet-600"
              >
                ← Continue Shopping
              </Link>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart