import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import {
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  Package,
  CalendarDays,
  IndianRupee,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'

const Profile = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        const data = await res.json()

        if (res.ok) {
          setOrders(Array.isArray(data) ? data : [])
        } else {
          if (res.status === 401) {
            logout()
            navigate('/login')
          }

          setOrders([])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyOrders()
  }, [user, navigate, logout])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#fafafd] px-5 py-10 text-[#17213d] md:px-10">

      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-2 text-sm font-semibold text-violet-600">
              NUVORA / Account
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-[#7c8498]">
              Manage your account and keep track of your orders.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 rounded-full border border-red-100 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="mb-8 overflow-hidden rounded-[28px] border border-[#eeeeF5] bg-white shadow-[0_10px_35px_rgba(40,30,80,0.05)]">

          {/* Purple top section */}
          <div className="h-28 bg-gradient-to-r from-violet-600 via-violet-500 to-[#8b5cf6]" />

          <div className="px-6 pb-7 md:px-8">

            {/* Avatar */}
            <div className="-mt-12 mb-5 flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-white bg-[#f1eaff] text-violet-600 shadow-md">
              <UserRound size={38} />
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>
                <h2 className="text-2xl font-extrabold">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-[#7c8498]">
                  Welcome back to NUVORA
                </p>
              </div>

              <span className="flex w-fit items-center gap-2 rounded-full bg-[#f1eaff] px-4 py-2 text-xs font-bold uppercase tracking-wide text-violet-600">
                <ShieldCheck size={15} />
                {user.role}
              </span>

            </div>

            {/* Account information */}
            <div className="mt-7 grid gap-4 border-t border-[#eeeeF5] pt-6 md:grid-cols-2">

              <div className="flex items-center gap-4 rounded-2xl bg-[#fafafd] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1eaff] text-violet-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <p className="text-xs text-[#8a91a4]">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#fafafd] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f8f4] text-emerald-500">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#8a91a4]">
                    Email Address
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {user.email}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= ORDER SECTION ================= */}
        <div>

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-extrabold">
                Order History
              </h2>

              <p className="mt-1 text-sm text-[#7c8498]">
                View your recent purchases and order status.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm sm:flex">
              <Package size={17} className="text-violet-600" />
              {orders.length} Orders
            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-[24px] border border-[#eeeeF5] bg-white py-16 text-center shadow-[0_8px_30px_rgba(40,30,80,0.04)]">

              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#e9e2ff] border-t-violet-600" />

              <p className="text-sm text-[#7c8498]">
                Fetching your orders...
              </p>

            </div>
          ) : orders.length === 0 ? (

            /* Empty Orders */
            <div className="rounded-[24px] border border-[#eeeeF5] bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(40,30,80,0.04)]">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eaff] text-violet-600">
                <ShoppingBag size={27} />
              </div>

              <h3 className="text-xl font-bold">
                No orders yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#7c8498]">
                You haven't placed any orders yet. Explore our collection
                and find something you love.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Start Shopping
                <ArrowRight size={17} />
              </Link>

            </div>
          ) : (

            /* Orders */
            <div className="space-y-4">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="rounded-[24px] border border-[#eeeeF5] bg-white p-5 shadow-[0_8px_30px_rgba(40,30,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(40,30,80,0.07)] md:p-6"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    {/* Order information */}
                    <div className="grid gap-5 sm:grid-cols-3">

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1eaff] text-violet-600">
                          <Package size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-[#8a91a4]">
                            Order ID
                          </p>

                          <p className="mt-1 max-w-[150px] truncate text-sm font-bold">
                            {order._id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5ff] text-blue-500">
                          <CalendarDays size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-[#8a91a4]">
                            Placed On
                          </p>

                          <p className="mt-1 text-sm font-bold">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf9f3] text-emerald-500">
                          <IndianRupee size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-[#8a91a4]">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-violet-600">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-600'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default Profile