import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Plus, Pencil, Trash2, IndianRupee, Tag, Boxes } from 'lucide-react';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you strictly sure you want to delete this?')) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
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
                <Package className="h-5 w-5 text-purple-600" />
              </div>

              <span className="text-sm font-medium text-purple-600">
                NUVORA ADMIN
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#171329] sm:text-3xl">
              Manage Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit and manage your store products
            </p>
          </div>

          {/* Add Product */}
          <Link
            to="/admin/add-product"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#6d35e8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-[#5c27d6] hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>

        </div>

        {/* Product Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(80,50,150,0.06)]">

          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <h2 className="text-lg font-bold text-[#171329]">
                All Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your product catalog and inventory
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-purple-50 px-4 py-2">
              <Package className="h-4 w-4 text-purple-600" />

              <span className="text-sm font-semibold text-purple-600">
                {products.length} Products
              </span>
            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-gray-100 bg-[#fcfbff]">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {products.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                        <Package className="h-6 w-6 text-purple-500" />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#171329]">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Add your first product to get started.
                      </p>

                      <Link
                        to="/admin/add-product"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6d35e8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c27d6]"
                      >
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Link>

                    </td>
                  </tr>

                ) : (

                  products.map((product) => (

                    <tr
                      key={product._id}
                      className="group transition-colors hover:bg-[#faf8ff]"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">

                        <span className="rounded-lg bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-500">
                          {product._id.substring(0, 8)}...
                        </span>

                      </td>

                      {/* Product Name */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#171329]">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Product
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Price */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-1 font-semibold text-[#171329]">
                          <IndianRupee className="h-4 w-4 text-purple-600" />
                          {product.price.toFixed(2)}
                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">

                        <div className="flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">

                          <Tag className="h-3.5 w-3.5 text-purple-500" />

                          <span className="text-xs font-semibold text-purple-600">
                            {product.category}
                          </span>

                        </div>

                      </td>

                      {/* Stock */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              product.stock > 0
                                ? 'bg-emerald-50'
                                : 'bg-red-50'
                            }`}
                          >
                            <Boxes
                              className={`h-4 w-4 ${
                                product.stock > 0
                                  ? 'text-emerald-600'
                                  : 'text-red-500'
                              }`}
                            />
                          </div>

                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                product.stock > 0
                                  ? 'text-[#171329]'
                                  : 'text-red-500'
                              }`}
                            >
                              {product.stock}
                            </p>

                            <p className="text-xs text-gray-400">
                              {product.stock > 0
                                ? 'In stock'
                                : 'Out of stock'}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          {/* Edit */}
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-600 transition-all hover:border-purple-200 hover:bg-purple-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-500 transition-all hover:border-red-200 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>
          </div>

          {/* Footer */}
          {products.length > 0 && (
            <div className="border-t border-gray-100 bg-[#fcfbff] px-6 py-4">

              <p className="text-xs text-gray-400">
                Showing{' '}
                <span className="font-semibold text-gray-600">
                  {products.length}
                </span>{' '}
                product{products.length !== 1 ? 's' : ''}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminProducts;