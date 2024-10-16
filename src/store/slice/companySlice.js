import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyID:localStorage.getItem('companyID') || null,
  companyName:localStorage.getItem('companyName') || null,
};

export const companySlice = createSlice({
  name: 'companySlice',
  initialState,
  reducers: {
    selectCompany: (state, { payload }) => {
      state.companyID = payload;
      localStorage.setItem('companyID', JSON.stringify(payload));
    },
    selectCompanyName: (state, { payload }) => {
      state.companyName = payload;
      localStorage.setItem('companyName', JSON.stringify(payload));

    },
    clearCompany: (state) => {
      state.companyID = null;
      localStorage.removeItem('companyID');
      localStorage.removeItem('companyName');
    }
  }
});


export const { selectCompany ,selectCompanyName, clearCompany } = companySlice.actions;
export default companySlice.reducer;
