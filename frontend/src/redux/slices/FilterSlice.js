import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    filter: (state, action) => {
      if (!state.filters.includes(action.payload)) {
        state.filters = [...state.filters, action.payload];
      } else {
        const filterCategories = state.filters.filter(
          (item) => item !== action.payload
        );
        state.filters = filterCategories;
      }
    },
  },
});

export const { filter } = filterSlice.actions;
export default filterSlice.reducer;
