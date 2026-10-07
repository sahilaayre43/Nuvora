import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStats({
            totalOrders: data.totalOrders || 0,
            totalProducts: data.totalProducts || 0,
            totalUsers: data.totalUsers || 0,
            totalRevenue: data.totalRevenue || 0,
          });
        } else if (res.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-purple-600">
              NUVORA ADMIN
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your store and keep track of your business.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {loading ? "..." : card.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}
                  >
                    <Icon size={21} className={card.iconColor} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp size={14} />
                  Store overview
                </div>
              </div>
            );
          })}
        </div>

        {/* Main section */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Overview */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Store Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Quick overview of your NUVORA store.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                <TrendingUp
                  size={19}
                  className="text-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-[#faf9ff] p-5">
                <p className="text-sm text-slate-500">
                  Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalOrders}
                </p>

                <div className="mt-3 h-1.5 rounded-full bg-purple-100">
                  <div className="h-1.5 w-3/4 rounded-full bg-purple-500" />
                </div>
              </div>

              <div className="rounded-xl bg-[#f7fbff] p-5">
                <p className="text-sm text-slate-500">
                  Products
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalProducts}
                </p>

                <div className="mt-3 h-1.5 rounded-full bg-blue-100">
                  <div className="h-1.5 w-2/3 rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="rounded-xl bg-[#fff9f1] p-5">
                <p className="text-sm text-slate-500">
                  Customers
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalUsers}
                </p>

                <div className="mt-3 h-1.5 rounded-full bg-yellow-100">
                  <div className="h-1.5 w-1/2 rounded-full bg-yellow-500" />
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your store quickly.
            </p>

            <div className="mt-5 space-y-3">

              <button
                onClick={() => navigate("/admin/products")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    <Package
                      size={18}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Manage Products
                    </p>

                    <p className="text-xs text-slate-500">
                      Add, edit or remove products
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition group-hover:text-purple-600"
                />
              </button>

              <button
                onClick={() => navigate("/admin/orders")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <ClipboardList
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      View Orders
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage customer orders
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition group-hover:text-blue-600"
                />
              </button>

              <button
                onClick={() => navigate("/admin/users")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-pink-200 hover:bg-pink-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
                    <Users
                      size={18}
                      className="text-pink-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      View Customers
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage registered users
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition group-hover:text-pink-600"
                />
              </button>

            </div>
          </div>
        </div>

        {/* Revenue card */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 p-6 text-white shadow-lg shadow-purple-200">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-purple-100">
                Total Store Revenue
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </h2>

              <p className="mt-1 text-sm text-purple-100">
                Revenue generated from all orders
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <IndianRupee size={26} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;