import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  ImagePlus,
  Save,
  ArrowLeft,
  IndianRupee,
  Layers3,
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
      });
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);

    if (image) {
      data.append('image', image);
    }

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: data,
    });

    setLoading(false);

    if (res.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Package className="h-5 w-5 text-purple-600" />
            </div>

            <span className="text-sm font-medium text-purple-600">
              NUVORA ADMIN
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#171329] sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your product information and inventory
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgba(80,50,150,0.06)] sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Information */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-[#171329]">
                    Product Information
                  </h2>

                  <p className="text-xs text-gray-400">
                    Basic details about your product
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Product Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#171329]">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#171329]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Describe your product"
                    required
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                  />
                </div>

                {/* Price + Category */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#171329]">
                      Price
                    </label>

                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#171329]">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      placeholder="e.g. Audio"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                    />
                  </div>

                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#171329]">
                    Stock
                  </label>

                  <div className="relative">
                    <Layers3 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      name="stock"
                      placeholder="Available quantity"
                      required
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Image */}
            <div className="border-t border-gray-100 pt-6">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
                  <ImagePlus className="h-4 w-4 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-[#171329]">
                    Product Image
                  </h2>

                  <p className="text-xs text-gray-400">
                    Replace the existing image if needed
                  </p>
                </div>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 px-6 py-10 text-center transition hover:border-purple-400 hover:bg-purple-50">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ImagePlus className="h-5 w-5 text-purple-600" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#171329]">
                  {image ? image.name : 'Choose a new image'}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG or WEBP
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />

              </label>

              {image && (
                <p className="mt-2 text-xs text-purple-600">
                  New image selected: {image.name}
                </p>
              )}

            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d35e8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5c27d6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {loading ? 'Updating...' : 'Update Product'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;