import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, FolderKanban, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';

const AdminCategories = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const requestCategories = useCallback(async () => {
      const res = await fetch('/api/categories', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to load categories.');
      }
      if (!Array.isArray(data)) {
        throw new Error('The server returned an invalid categories response.');
      }
      return data;
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }
    if (!user.token) {
      navigate('/login', { replace: true });
      return;
    }
    let isCurrent = true;
    const loadCategories = async () => {
      try {
        const data = await requestCategories();
        if (isCurrent) {
          setCategories(data);
        }
      } catch (fetchError) {
        if (isCurrent) {
          setError(fetchError.message || 'Unable to load categories.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      isCurrent = false;
    };
  }, [user, navigate, requestCategories]);

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      setCategories(await requestCategories());
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to create category.');
      }

      setName('');
      setSuccess(`“${data.name}” is ready to use on products.`);
      setCategories(await requestCategories());
    } catch (createError) {
      setError(createError.message || 'Unable to create category.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (category) => {
    setError('');
    setSuccess('');
    setEditingCategory(category);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName('');
  };

  const handleUpdate = async (event, category) => {
    event.preventDefault();
    const updatedName = editName.trim();
    if (!updatedName || updatedName === category.name) {
      cancelEditing();
      return;
    }

    setError('');
    setSuccess('');
    setUpdatingId(category._id || category.name);
    try {
      const endpoint = category._id
        ? `/api/categories/${category._id}`
        : '/api/categories/legacy';
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          ...(category._id ? {} : { currentName: category.name }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to update category.');
      }

      setSuccess(`“${category.name}” was renamed to “${data.name}”.`);
      cancelEditing();
      setCategories(await requestCategories());
    } catch (updateError) {
      setError(updateError.message || 'Unable to update category.');
    } finally {
      setUpdatingId('');
    }
  };

  const handleDelete = async (category) => {
    if (!category._id || category.productCount > 0) {
      return;
    }
    if (!window.confirm(`Delete the "${category.name}" category?`)) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingId(category._id);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to delete category.');
      }

      setSuccess(`“${category.name}” was deleted.`);
      setCategories(await requestCategories());
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete category.');
    } finally {
      setDeletingId('');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fafaff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-600"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                <FolderKanban className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600">NUVORA ADMIN</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#171329]">Manage Categories</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add categories for your products and storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-purple-200 hover:text-purple-600 disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgba(80,50,150,0.05)] sm:p-7"
        >
          <h2 className="text-lg font-bold text-[#171329]">Add a category</h2>
          <p className="mt-1 text-sm text-gray-500">
            Existing product categories are already available below.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              required
              placeholder="e.g. Home Decor"
              aria-label="Category name"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-[#fcfbff] px-4 py-3 text-sm text-[#171329] outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50"
            />
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={17} />
              {saving ? 'Adding...' : 'Add category'}
            </button>
          </div>
        </form>

        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(80,50,150,0.05)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-[#171329]">Store categories</h2>
              <p className="mt-1 text-sm text-gray-500">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'}
              </p>
            </div>
          </div>
          {loading ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">
              No categories yet. Add one above to get started.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li
                  key={category._id || category.name}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  {editingCategory?.name === category.name ? (
                    <form
                      onSubmit={(event) => handleUpdate(event, category)}
                      className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        maxLength={60}
                        required
                        aria-label={`Edit ${category.name} category name`}
                        autoFocus
                        className="min-w-0 flex-1 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm text-[#171329] outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={updatingId !== '' || !editName.trim()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                        >
                          <Check size={14} />
                          {updatingId ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={updatingId !== ''}
                          aria-label="Cancel category edit"
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-60"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                          <FolderKanban size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#171329]">{category.name}</p>
                          <p className="text-xs text-gray-500">
                            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          disabled={updatingId !== '' || deletingId !== ''}
                          className="inline-flex w-fit items-center gap-2 rounded-xl border border-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-60"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={!category._id || category.productCount > 0 || deletingId !== ''}
                          title={category.productCount > 0
                            ? 'Reassign all products before deleting this category.'
                            : !category._id
                              ? 'This category comes from existing products and is not managed yet.'
                              : undefined}
                          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400 disabled:hover:bg-white"
                        >
                          <Trash2 size={14} />
                          {deletingId === category._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="border-t border-gray-100 bg-[#fcfbff] px-5 py-4 text-xs text-gray-500 sm:px-7">
            Categories with products assigned cannot be deleted. Reassign those products first.
          </p>
        </section>
      </div>
    </main>
  );
};

export default AdminCategories;
