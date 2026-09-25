import {createSlice} from "@reduxjs/toolkit";

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
        const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cartItems.push({...item, quantity: 1});
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    }
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;