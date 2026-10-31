import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Check, PackagePlus, X } from 'lucide-react';
import { getCategoryDesign } from '../lib/categoryDesign';

const MAX_PRODUCT_IMAGES = 8;

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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.message || 'Unable to load categories.');
        }
        if (isCurrent) {
          setCategories(data.filter((category) => category?.name));
        }
      } catch (error) {
        if (isCurrent) {
          setCategoriesError(error.message || 'Unable to load categories.');
        }
      } finally {
        if (isCurrent) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();
    return () => {
      isCurrent = false;
    };
  }, []);

  if (!user || user.role !== 'admin') {
    navigate('/admin/products');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    if (images.length === 0) {
      setSubmitError('Please select at least one product image.');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    images.forEach((image) => data.append('images', image));

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(responseData.message || 'Error creating product.');
      }
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || 'Unable to create product. Please try again.');
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
            <PackagePlus className="h-7 w-7 text-violet-600" aria-hidden="true" />
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

            {submitSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 shrink-0" />
                  Product created successfully.
                </span>
                <Link
                  to="/admin/products"
                  className="shrink-0 font-bold text-emerald-800 underline-offset-2 hover:underline"
                >
                  View products
                </Link>
              </div>
            )}

            {submitError && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

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
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-800">
                Category
              </legend>

              {categoriesLoading ? (
                <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  Loading categories...
                </p>
              ) : categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((category) => {
                    const design = getCategoryDesign(category.name);
                    const Icon = design.icon;
                    const isSelected = formData.category === category.name;

                    return (
                      <label key={category.name} className="cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={isSelected}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value
                            })
                          }
                          className="peer sr-only"
                        />
                        <span
                          className={`relative flex min-h-20 items-center gap-3 rounded-2xl border p-3 transition ${
                            isSelected
                              ? 'border-violet-400 bg-violet-50 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50/50'
                          } peer-focus-visible:ring-4 peer-focus-visible:ring-violet-100`}
                        >
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${design.bg} ${design.color}`}>
                            <Icon size={19} />
                          </span>
                          <span className="min-w-0 text-sm font-semibold text-gray-800">
                            {category.name}
                          </span>
                          {isSelected && (
                            <Check
                              size={16}
                              aria-hidden="true"
                              className="ml-auto shrink-0 text-violet-600"
                            />
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {categoriesError ? (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {categoriesError}
                </p>
              ) : categories.length === 0 && !categoriesLoading ? (
                <p className="mt-2 text-sm text-gray-500">
                  No categories yet. <Link className="font-semibold text-violet-600 hover:underline" to="/admin/categories">Create one</Link> before adding a product.
                </p>
              ) : null}
            </fieldset>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Product Images
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
                  Upload up to {MAX_PRODUCT_IMAGES} product images
                </p>

                <p className="mb-4 text-xs text-gray-500">
                  PNG, JPG or WEBP images are supported
                </p>

                <label className="inline-flex cursor-pointer items-center rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50">
                  Choose Images

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const selectedImages = Array.from(e.target.files || []);
                      if (selectedImages.length > MAX_PRODUCT_IMAGES) {
                        setSubmitError(`Choose no more than ${MAX_PRODUCT_IMAGES} images.`);
                        setImages([]);
                        e.target.value = '';
                        return;
                      }
                      setSubmitError('');
                      setImages(selectedImages);
                    }}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <ul className="mt-4 space-y-2 text-left">
                    {images.map((image, index) => (
                      <li
                        key={`${image.name}-${image.lastModified}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs text-gray-600"
                      >
                        <span className="truncate">{image.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${image.name}`}
                          onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
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