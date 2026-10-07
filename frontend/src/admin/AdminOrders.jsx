import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { Package, UserRound, CalendarDays, IndianRupee, ChevronDown, ShoppingBag } from 'lucide-react';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]); 

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';

      case 'Shipped':
        return 'bg-blue-50 text-blue-600 border-blue-100';

      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">

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

                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                        <Package className="h-6 w-6 text-purple-500" />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#171329]">
                        No orders found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Orders will appear here when customers place them.
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
                              {order.userId?.name || 'Deleted User'}
                            </p>

                            <p className="text-xs text-gray-400">
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 font-semibold text-[#171329]">
                          <IndianRupee className="h-4 w-4 text-purple-600" />

                          {order.totalAmount.toFixed(2)}
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

                          {/* Status Badge */}
                          <div
                            className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </div>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="h-9 w-[130px] cursor-pointer appearance-none rounded-full border border-gray-200 bg-white pl-3 pr-8 text-xs font-medium text-transparent outline-none transition-all hover:border-purple-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
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