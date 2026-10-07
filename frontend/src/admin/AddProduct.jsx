import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        alert('Product created successfully with Cloudinary Image URL!');
        navigate('/');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] px-4 py-10 sm:px-6 lg:px-8">

      {/* Main Card */}
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 shadow-sm">
            <span className="text-2xl">✦</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add New Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new product to your NUVORA store.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_10px_40px_rgba(80,50,150,0.07)] sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Description
              </label>

              <textarea
                placeholder="Describe your product..."
                required
                rows="5"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    placeholder="0.00"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  placeholder="Enter quantity"
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: e.target.value
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Category
              </label>

              <input
                type="text"
                placeholder="e.g. Audio, Furniture, Cameras"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value
                  })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Product Image
              </label>

              <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 p-6 text-center transition hover:border-violet-300 hover:bg-violet-50">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <svg
                    className="h-6 w-6 text-violet-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <p className="mb-1 text-sm font-semibold text-gray-800">
                  Upload product image
                </p>

                <p className="mb-4 text-xs text-gray-500">
                  PNG, JPG or WEBP images are supported
                </p>

                <label className="inline-flex cursor-pointer items-center rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50">
                  Choose Image

                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                {image && (
                  <p className="mt-3 text-xs font-medium text-gray-600">
                    Selected: {image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Uploading & Creating...' : 'Publish Product'}
            </button>

          </form>
        </div>

        {/* Bottom note */}
        <p className="mt-5 text-center text-xs text-gray-400">
          Product images will be securely uploaded to Cloudinary.
        </p>

      </div>
    </div>
  );
};

export default AddProduct;