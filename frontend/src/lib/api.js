const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiFetch = (path, options) =>
  fetch(`${apiBaseUrl}${path}`, options);

const readStaticList = async (path) => {
  const response = await fetch(path);
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 404 || !contentType.includes('application/json')) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('The catalog response was not a list.');
  }
  return data;
};

const loadList = async (staticPath, apiPath, label) => {
  const staticList = await readStaticList(staticPath);
  if (staticList !== null) {
    return staticList;
  }

  return requestList(apiPath, label);
};

const requestList = async (apiPath, label) => {
  const response = await apiFetch(apiPath);
  if (!response.ok) {
    throw new Error(`${label} request failed (${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`The ${label.toLowerCase()} response was not a list.`);
  }
  return data;
};

export const loadProductCatalog = () =>
  loadList('/catalog.json', '/api/products', 'Product');

export const loadCategoryCatalog = () =>
  loadList('/categories.json', '/api/categories', 'Category');

export const refreshProductCatalog = () =>
  requestList('/api/products', 'Product');

export const refreshCategoryCatalog = () =>
  requestList('/api/categories', 'Category');
