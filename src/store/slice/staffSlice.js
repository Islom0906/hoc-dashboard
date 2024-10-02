import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffIDs: ''
};

export const staffSlice = createSlice({
  name: 'staffSlice',
  initialState,
  reducers: {
    selectStaffIDs: (state, { payload }) => {
      state.staffIDs = payload;
    },
    clearStaffIDs: (state) => {
      state.staffIDs = null;
    }
  }
});


export const { selectStaffIDs, clearStaffIDs } = staffSlice.actions;
export default staffSlice.reducer;
