import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId;
  const totalAmount = state?.totalAmount;
  const paymentMethod = state?.paymentMethod;

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f6ff] px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">
          ✓
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-[#171329]">
          Order placed successfully!
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {paymentMethod === 'COD'
            ? 'Your order is confirmed. Please pay the delivery person when it arrives.'
            : 'Your payment was received and your order is confirmed.'}
        </p>
        {orderId && (
          <p className="mt-5 text-sm text-gray-600">
            Order number: <span className="font-semibold text-[#171329]">{orderId}</span>
          </p>
        )}
        {typeof totalAmount === 'number' && (
          <p className="mt-2 text-sm text-gray-600">
            Order total: <span className="font-semibold text-[#171329]">₹{totalAmount.toLocaleString('en-IN')}</span>
          </p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/profile"
            className="rounded-full bg-[#6d35e8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5c27d6]"
          >
            View my orders
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-purple-200 px-6 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
