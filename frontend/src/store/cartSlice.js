import {createSlice} from "@reduxjs/toolkit";

const getItemId = (item) => item.productId ?? item.id ?? item._id;

const initialState = {
  cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems"))
  : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
        const item = action.payload;
        const itemId = getItemId(item);
        const existingItem = state.cartItems.find((cartItem) => getItemId(cartItem) === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cartItems.push({...item, quantity: 1});
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => getItemId(item) === id);
      if (existingItem) {
        existingItem.quantity = quantity;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => getItemId(item) !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    }
  },
});

export const { addItem, setItemQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;