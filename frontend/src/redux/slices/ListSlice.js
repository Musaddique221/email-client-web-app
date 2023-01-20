import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailList: [],
};

const EmailListSlice = createSlice({
  name: "emailList",
  initialState,
  reducers: {
    setList: (state, action) => {
     state.emailList = action.payload;
    },
  },
});

export const { setList } = EmailListSlice.actions;
export default EmailListSlice.reducer;
