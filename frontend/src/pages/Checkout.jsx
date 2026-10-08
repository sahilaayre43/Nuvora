import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
import { clearCart } from '../store/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.qty ?? item.quantity ?? 1),
    0
  );

  const placeOrder = async (paymentId) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        address,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'RAZORPAY',
        ...(paymentId ? { paymentId } : {})
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to place your order.');
    }

    dispatch(clearCart());
    navigate('/ordersuccess', {
      state: {
        orderId: data._id,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod
      }
    });
  };

  const startOnlinePayment = async () => {
    const response = await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice })
    });
    const orderData = await response.json();

    if (!response.ok) {
      throw new Error(orderData.message || 'Online payment is currently unavailable. Please use Cash on Delivery.');
    }
    if (!window.Razorpay) {
      throw new Error('The payment form could not be loaded. Please use Cash on Delivery.');
    }

    const razorpay = new window.Razorpay({
      key: 'rzp_test_dummykey123',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'NUVORA',
      description: 'Order Payment',
      order_id: orderData.id,
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentResponse)
          });
          const verification = await verifyResponse.json();
          if (!verifyResponse.ok) {
            throw new Error(verification.message || 'Payment verification failed.');
          }
          await placeOrder(paymentResponse.razorpay_payment_id);
        } catch (error) {
          setErrorMessage(error.message || 'Unable to complete your order.');
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: address.fullName,
        email: user.email
      },
      theme: { color: '#6d35e8' },
      modal: { ondismiss: () => setIsSubmitting(false) }
    });

    razorpay.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!user?.token) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (paymentMethod === 'cod') {
        await placeOrder();
      } else {
        await startOnlinePayment();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  const updateAddress = (field) => (event) => {
    setAddress((currentAddress) => ({
      ...currentAddress,
      [field]: event.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-bold text-[#171329]">Checkout</h2>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-[#171329]">Your cart is empty.</p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-4 rounded-full bg-[#6d35e8] px-6 py-3 text-sm font-bold text-white"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1fr_380px]"
          >
            <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-[#171329]">
                Shipping Address
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  required
                  value={address.fullName}
                  onChange={updateAddress('fullName')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  autoComplete="street-address"
                  required
                  value={address.street}
                  onChange={updateAddress('street')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                  value={address.city}
                  onChange={updateAddress('city')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  autoComplete="address-level1"
                  required
                  value={address.state}
                  onChange={updateAddress('state')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  autoComplete="postal-code"
                  required
                  value={address.postalCode}
                  onChange={updateAddress('postalCode')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  autoComplete="country-name"
                  required
                  value={address.country}
                  onChange={updateAddress('country')}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>
            </section>

            <section className="h-fit rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#171329]">Order Summary</h3>

              <div className="my-6 border-t border-gray-100 pt-5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Items</span>
                  <span>
                    {cartItems.reduce(
                      (count, item) => count + Number(item.qty ?? item.quantity ?? 1),
                      0
                    )}
                  </span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-extrabold text-[#6d35e8]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-bold text-[#171329]">
                  Payment Method
                </legend>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === 'cod'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-purple-600"
                    />
                    <span>
                      <span className="block font-bold text-gray-800">
                        Cash on Delivery
                      </span>
                      <span className="text-xs text-gray-500">
                        Pay when your order arrives
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === 'razorpay'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-purple-600"
                    />
                    <span>
                      <span className="block font-bold text-gray-800">
                        Online Payment
                      </span>
                      <span className="text-xs text-gray-500">
                        Pay securely using Razorpay
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              {errorMessage && (
                <p role="alert" className="mt-4 text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-2xl bg-[#6d35e8] py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5c27d6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Processing...'
                  : paymentMethod === 'cod'
                    ? 'Place Order'
                    : 'Pay Now'}
              </button>
            </section>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
