import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modulsID:localStorage.getItem('modulsID') || null
};

export const modulsSlice = createSlice({
  name: 'modulsSlice',
  initialState,
  reducers: {
    selectModuls: (state, { payload }) => {
      state.modulsID = payload;
      localStorage.setItem('modulsID', JSON.stringify(payload));
    },
    clearModuls: (state) => {
      state.modulsID = null;
      localStorage.removeItem('modulsID');
    }
  }
});


export const { selectModuls, clearModuls } = modulsSlice.actions;
export default modulsSlice.reducer;
