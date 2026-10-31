import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { Package, UserRound, CalendarDays, IndianRupee, ChevronDown, ShoppingBag, MapPin } from 'lucide-react';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderIds, setUpdatingOrderIds] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      if (!user?.token) {
        setOrders([]);
        setError('Please sign in as an administrator to view orders.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/orders', {
          headers: {
          Authorization: `Bearer ${user.token}`,
        },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Unable to fetch orders.');
        }
        if (!Array.isArray(data)) {
          throw new Error('The server returned an invalid orders response.');
        }
        if (isCurrent) {
          setOrders(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || 'Unable to fetch orders.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const updateStatus = async (id, status) => {
    setError('');
    setUpdatingOrderIds((ids) => [...ids, id]);

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to update order status.');
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id ? { ...order, status: data.status || status } : order
        )
      );
    } catch (err) {
      setError(err.message || 'Unable to update order status.');
    } finally {
      setUpdatingOrderIds((ids) => ids.filter((orderId) => orderId !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'shipped':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'processing':
        return 'border-violet-200 bg-violet-50 text-violet-700';
      case 'cancelled':
        return 'border-gray-200 bg-gray-50 text-gray-600';
      case 'pending':
      default:
        return 'border-amber-200 bg-amber-50 text-amber-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-sm font-medium text-purple-600">
                NUVORA ADMIN
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#171329] sm:text-3xl">
              Manage Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage customer orders
            </p>
          </div>

          {/* Order count */}
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <Package className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg font-bold text-[#171329]">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(80,50,150,0.06)]">

          {/* Card Header */}
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-[#171329]">
                All Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of your customer's purchases
              </p>
            </div>

            <div className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
              {orders.length} Orders
            </div>
          </div>

          {error && orders.length > 0 && (
            <p
              role="alert"
              className="mx-5 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7"
            >
              {error}
            </p>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              {/* Table Head */}
              <thead>
                <tr className="border-b border-gray-100 bg-[#fcfbff]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Delivery Address
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {loading || orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                        <Package className="h-6 w-6 text-purple-500" />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#171329]">
                        {loading ? 'Loading orders...' : error ? 'Could not load orders' : 'No orders found'}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {error || (loading
                          ? 'Fetching customer orders.'
                          : 'Orders will appear here when customers place them.')}
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="group transition-colors hover:bg-[#faf8ff]"
                    >

                      {/* Order ID */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                            <Package className="h-4 w-4 text-purple-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#171329]">
                              #{order._id.substring(0, 8)}
                            </p>

                            <p className="text-xs text-gray-400">
                              Order
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
                            <UserRound className="h-4 w-4 text-purple-600" />
                          </div>

                          <div>
                            <p className="font-medium text-[#171329]">
                              {order.user?.name || 'Deleted User'}
                            </p>

                            <p className="text-xs text-gray-400">
                              {order.user?.email || 'Customer'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Delivery address */}
                      <td className="px-6 py-5">
                        {order.address ? (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                            <div>
                              <p className="font-medium text-[#171329]">
                                {order.address.fullName}
                              </p>
                              {order.address.phone ? (
                                <a
                                  href={`tel:${order.address.phone}`}
                                  className="text-purple-600 hover:underline"
                                >
                                  {order.address.phone}
                                </a>
                              ) : (
                                <p className="text-xs text-gray-400">
                                  No mobile number on this order
                                </p>
                              )}
                              <p>{order.address.street}</p>
                              <p>
                                {[
                                  order.address.city,
                                  order.address.state,
                                  order.address.postalCode,
                                  order.address.country,
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">
                            No address on this order
                          </p>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 font-semibold text-[#171329]">
                          <IndianRupee className="h-4 w-4 text-purple-600" />

                          {Number(order.totalAmount || 0).toFixed(2)}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-gray-400" />

                          {new Date(
                            order.createdAt
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <div className="relative w-fit">

                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            aria-label={`Update status for order ${order._id}`}
                            disabled={updatingOrderIds.includes(order._id)}
                            className={`h-10 w-[145px] cursor-pointer appearance-none rounded-full border pl-3 pr-9 text-xs font-semibold outline-none transition-all hover:shadow-sm focus:ring-4 focus:ring-purple-100 disabled:cursor-wait disabled:opacity-60 ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current" />
                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* Bottom */}
          {orders.length > 0 && (
            <div className="border-t border-gray-100 bg-[#fcfbff] px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing{' '}
                <span className="font-semibold text-gray-600">
                  {orders.length}
                </span>{' '}
                order{orders.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;