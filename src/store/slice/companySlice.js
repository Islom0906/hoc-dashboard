import { createSlice } from "@reduxjs/toolkit";

const savedCompany = localStorage.getItem('companyID');
const initialState = {
  companyID: savedCompany ? JSON.parse(savedCompany) : null
};

export const companySlice = createSlice({
  name: 'companySlice',
  initialState,
  reducers: {
    selectCompany: (state, { payload }) => {
      state.companyID = payload;
      localStorage.setItem('companyID', JSON.stringify(payload));
    },
    clearCompany: (state) => {
      state.companyID = null;
      localStorage.removeItem('companyID');
    }
  }
});


export const { selectCompany, clearCompany } = companySlice.actions;
export default companySlice.reducer;
