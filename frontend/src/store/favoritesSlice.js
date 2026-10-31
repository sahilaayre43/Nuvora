import { createSlice } from "@reduxjs/toolkit";

const getProductId = (product) => String(product?._id ?? product?.id ?? "");

const loadFavorites = () => {
  const savedFavorites = localStorage.getItem("favoriteItems");
  if (!savedFavorites) return [];

  const parsedFavorites = JSON.parse(savedFavorites);
  return Array.isArray(parsedFavorites)
    ? parsedFavorites.filter((product) => getProductId(product))
    : [];
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: loadFavorites(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const productId = getProductId(product);
      if (!productId) return;

      const existingIndex = state.items.findIndex(
        (item) => getProductId(item) === productId
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }

      localStorage.setItem("favoriteItems", JSON.stringify(state.items));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
